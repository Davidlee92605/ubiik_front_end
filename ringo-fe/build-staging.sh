#!/bin/bash

set -e

rm -rf dist

# build standard English language version
#ng build --configuration staging

build() {
	lang=$1
	# aot needed for translations to be compiled in to output
	ng build --configuration staging --aot --i18n-locale $lang --i18n-format xlf --i18n-file src/translate/messages.$lang.xliff --output-path=dist/$lang --baseHref /$lang/
}

ng build --aot --configuration staging front-page

# additional languages
build en
build ja
build zh
#build fr
