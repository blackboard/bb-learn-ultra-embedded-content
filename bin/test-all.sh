YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in packages/*;
do
    cd ${d}
    echo -e ${YELLOW}"Running tests: ${d:9}"${NC}
    npm run test
    cd ../..
done

echo -e ${YELLOW}"Testing completed!"${NC}