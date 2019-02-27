#!/bin/bash

echo "The following will happen:"
echo "- Delete folder generated"
echo "- Generate webpack configs and upload all to s3"
echo "- Generate Parcel configs and upload all to s3"
echo ""
echo "Make sure you have built latest version to bin/webpack-autoconf.js"
read -p "Are you sure you want to continue? <y/N> " prompt
if [[ $prompt == "n" || $prompt == "N" || $prompt == "no" || $prompt == "No" ]]
then
  exit 0
fi

function generate {
    echo "Generating " $1
rm -rf generated
node bin/webpack-autoconf.js all $1

cd generated
mkdir zips

ls | xargs -I % zip -r zips/%.zip %

aws s3 --profile jakob sync zips s3://jakoblind/zips-$1
cd -
}

generate webpack
generate parcel
