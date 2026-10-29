// パンフレットの PDF のページを JPEG にして、目で確かめるためのスクリプト（この Mac には pdftoppm などがないため、macOS の PDFKit を使う）。
// 仕上がり線（trimBox）で切り抜いた形で書き出す。
//
//   swift scripts/pages-to-jpeg.swift <PDF> <書き出す先の頭の名前> [ページ番号,ページ番号,…]
//   例：swift scripts/pages-to-jpeg.swift output/classic.pdf /tmp/check/classic 1,4,6
//       → /tmp/check/classic-p1.jpg・-p4.jpg・-p6.jpg（ページ番号を省くと全ページ）
import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
  FileHandle.standardError.write("使い方: swift scripts/pages-to-jpeg.swift <PDF> <書き出す先の頭の名前> [1,4,6]\n".data(using: .utf8)!)
  exit(1)
}
let pages = args.count >= 4 ? args[3].split(separator: ",").compactMap { Int($0) } : Array(1...doc.pageCount)
for p in pages {
  guard let page = doc.page(at: p - 1) else { continue }
  let image = page.thumbnail(of: NSSize(width: 900, height: 900), for: .trimBox)
  guard let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
        let jpeg = rep.representation(using: .jpeg, properties: [:]) else { continue }
  let dest = "\(args[2])-p\(p).jpg"
  try jpeg.write(to: URL(fileURLWithPath: dest))
  print(dest)
}
print("全 \(doc.pageCount) ページ")
