RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in content-providers/*;
do
    cd ${d}
    echo -e ${YELLOW}"Running tests w/ coverage: ${d}"${NC}
    npm run test:coverage
    cd ../..
done

cd library
echo -e ${YELLOW}"Running tests w/ coverage: library"${NC}
npm run test:coverage
cd ..
echo -e ${YELLOW}"Testing w/ coverage complete!"${NC}
