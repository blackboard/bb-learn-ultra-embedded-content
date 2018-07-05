YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in content-providers/*;
do
    cd ${d}
    echo -e ${YELLOW}"Running linter: ${d}"${NC}
    npm run lint
    cd ../..
done

cd library
echo -e ${YELLOW}"Running linter: library"${NC}
npm run lint
cd ..
echo -e ${YELLOW}"Linting complete!"${NC}
