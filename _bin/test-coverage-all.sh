RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in packages/*;
do
    cd ${d}
    echo -e ${YELLOW}"Running tests w/ coverage: ${d:9}"${NC}
    npm run test:coverage
    cd ../..
done

echo -e ${YELLOW}"Testing w/ coverage completed!"${NC}
