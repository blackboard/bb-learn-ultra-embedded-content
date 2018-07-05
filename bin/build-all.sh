RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in content-providers/*;
do
    cd ${d}
    echo -e ${YELLOW}"Starting build: ${d}"${NC}
    npm run build
    cd ../..
done
