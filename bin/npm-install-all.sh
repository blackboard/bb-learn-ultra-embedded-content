YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

# The library install must happen first to ensure cross-package dependencies
cd library
echo -e ${YELLOW}"Running npm install: library"${NC}
npm install
cd ..

for d in content-providers/*;
do
    cd ${d}
    echo -e ${YELLOW}"Running npm install: ${d}"${NC}
    npm install
    npm run build
    cd ../..
done
echo -e ${YELLOW}"Library and Sub-folder install complete!"${NC}
