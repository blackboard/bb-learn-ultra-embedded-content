YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

# The bb-public-library utilities then react-components commands must happen first to ensure cross-package dependencies
pushd bb-public-library/utilities;
    if [ -f package.json ]
    then
        echo -e ${YELLOW}"Running command '${1}': bb-public-library/utilities"${NC}
        eval $1
    fi
popd
pushd bb-public-library/react-components;
    if [ -f package.json ]
    then
        echo -e ${YELLOW}"Running command '${1}': bb-public-library/react-components"${NC}
        eval $1
    fi
popd

# Only run command on library if this is a root only operation
if [ "$2" = "rootOnly" ]
then
    echo -e ${YELLOW}"'${1}' command run on all Libraries!"${NC}
    exit
fi

# Apply command to all getting-started apps
for d in example-apps/getting-started/*; do
    cd ${d}
    if [ -f package.json ]
    then
        echo -e ${YELLOW}"Running command '${1}': ${d}"${NC}
        eval $1
    fi
    cd ../../..
done

# Apply command to all js example apps
for d in example-apps/js/*; do
    cd ${d}
    if [ -f package.json ]
    then
        echo -e ${YELLOW}"Running command '${1}': ${d}"${NC}
        eval $1
    fi
    cd ../../..
done

# Apply command to all jsx example apps
for d in example-apps/jsx/*; do
    cd ${d}
    if [ -f package.json ]
    then
        echo -e ${YELLOW}"Running command '${1}': ${d}"${NC}
        eval $1
    fi
    cd ../../..
done

# Apply commond to all tsx example apps
for d in example-apps/tsx/*; do
    cd ${d}
    if [ -f package.json ]
    then
        echo -e ${YELLOW}"Running command '${1}': ${d}"${NC}
        eval $1
    fi
    cd ../../..
done

echo -e ${YELLOW}"'${1}' command run on all Libraries and example UI Apps!"${NC}
