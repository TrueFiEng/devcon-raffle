#!/bin/bash
set -eu

extract_json() {
    local json_file="$1"
    local key="$2"

    local python_command="import json,sys;obj=json.load(sys.stdin);print(obj['${key}'])"
    python3 -c "${python_command}" < "${json_file}"
}

extract_version() {
    local text="$1"

    [[ "${text}" =~ [0-9\.]+ ]]
    echo "${BASH_REMATCH}"
}

setup_solc() {
    echo "Setting up solc..." >&2
    local solc_version="$(extract_version "$(solc --version)")"
    local compiler_version="$(extract_version "$(extract_json .compiler.json version)")"

    echo "Found solc version ${solc_version} and Hardhat compiler version ${compiler_version}." >&2
    if [[ "${solc_version}" != "${compiler_version}" ]]; then
        echo "Updating solc version to ${compiler_version}..." >&2
        pip3 install solc-select
        solc-select install "${compiler_version}"
        solc-select use "${compiler_version}"
    fi
}

setup_certora() {
    echo "Setting up Certora..." >&2
    local certora_version="$(extract_version "$(certoraRun --version)")"
    local desired_version="3.1.0"

    echo "Found Certora version ${certora_version} and desired version ${desired_version}." >&2
    if [[ "${certora_version}" != "${desired_version}" ]]; then
        echo "Updating Certora version to ${desired_version}..." >&2
        pip3 install certora-cli==${desired_version}
    fi

    if [[ -z "${CERTORAKEY}" ]]; then
        echo "CERTORAKEY environment variable is empty." >&2
        exit 1
    fi
    echo "Found CERTORAKEY environment variable." >&2
}

main() {
    setup_solc
    setup_certora

    SANITY=''
    FAIL_ON_FIRST=false

    while getopts 'sf' flag; do
        case "${flag}" in
            s) SANITY='--rule_sanity' ;;
            f) FAIL_ON_FIRST=true ;;
            *) exit 1 ;;
        esac
    done

    pids=""
    RESULT=0

    RE_VERIFIED_NOT_SANITY='.*Verified((?!_sanity).)*'
    RE_VIOLATED_SANITY='.*Violated.*_sanity.*'

    RE="(${RE_VERIFIED_NOT_SANITY})|(${RE_VIOLATED_SANITY})"
    set -o pipefail
    confs=$(find spec -path '*.conf')
    PACKAGES_PATH=$(dirname "$(dirname $PWD)")/node_modules

    for conf in $confs; do
        ( certoraRun $conf $SANITY --packages_path $PACKAGES_PATH | perl -ne "print if not /${RE}/" ) &
        pids="$pids $!"
        sleep 15
    done

    for pid in $pids; do
        wait $pid || let "RESULT=1"
    done

    if [ "$RESULT" == "1" ]; then
       exit 1
    fi
}

main "$@"
