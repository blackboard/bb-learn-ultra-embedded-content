RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in packages/*; do
    if [ "$d" != "packages/bb-library-ui-components" ] && [ "$d" != "packages/bb-library-utilities" ]; then
        cd ${d}
        echo -e ${YELLOW}"Starting build: ${d:9}"${NC}
        npm run build
        cd ../..
    fi
done

echo -e ${YELLOW}"Building completed!"${NC}
