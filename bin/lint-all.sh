YELLOW='\033[1;33m'
NC='\033[0m' # No Color
set -e

for d in packages/*;
do
    cd ${d}
    echo -e ${YELLOW}"Running linter: ${d:9}"${NC}
    npm run lint
    cd ../..
done

echo -e ${YELLOW}"Linting complete!"${NC}