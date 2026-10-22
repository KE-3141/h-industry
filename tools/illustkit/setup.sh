#!/bin/bash
# illustkit が使う Ghostscript と PyMuPDF を、ほかと分けた環境に入れる（1回だけ）。
# Homebrew で Ghostscript をビルドできない Mac でも動くように、conda-forge のビルド済みのものを使う。
set -euo pipefail
DIR="$HOME/.local/share/illustkit"
mkdir -p "$DIR"
cd "$DIR"
case "$(uname -m)" in
  arm64) PLAT=osx-arm64 ;;
  x86_64) PLAT=osx-64 ;;
  *) echo "この CPU には対応していません: $(uname -m)" >&2; exit 1 ;;
esac
if [ ! -x bin/micromamba ]; then
  curl -fsSL "https://micro.mamba.pm/api/micromamba/$PLAT/latest" | tar -xj bin/micromamba
fi
MAMBA_ROOT_PREFIX="$DIR/mamba" ./bin/micromamba create -y -p "$DIR/env" -c conda-forge python=3.12 ghostscript pymupdf pillow
"$DIR/env/bin/gs" --version
"$DIR/env/bin/python" -c "import pymupdf, PIL; print('PyMuPDF', pymupdf.__version__, 'Pillow', PIL.__version__)"
echo "準備ができました: $DIR/env"
