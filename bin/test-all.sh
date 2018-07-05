YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in content-providers/*;
do
    cd ${d}
    echo -e ${YELLOW}"Running tests: ${d}"${NC}
    npm run test
    cd ../..
done

cd library
echo -e ${YELLOW}"Running tests: library"${NC}
npm run test
cd ..
echo -e ${YELLOW}"Testing complete!"${NC}
