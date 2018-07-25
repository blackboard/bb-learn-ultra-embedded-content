YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

# The bb-library-utilities install must happen first to ensure cross-package dependencies
cd packages/bb-library-utilities
echo -e ${YELLOW}"Running npm install: bb-library-utilities"${NC}
npm install
cd ../..

# The bb-library-ui-components install must happen first to ensure cross-package dependencies
cd packages/bb-library-ui-components
echo -e ${YELLOW}"Running npm install: bb-library-ui-components"${NC}
npm install
cd ../..

for d in packages/*; do
    if [ "$d" != "packages/bb-library-ui-components" ] && [ "$d" != "packages/bb-library-utilities" ]; then
        cd ${d}
        echo -e ${YELLOW}"Running npm install: ${d:9}"${NC}
        npm install
        npm run build
        cd ../..
    fi
done
echo -e ${YELLOW}"Libraries and UI Packages install completed!"${NC}
