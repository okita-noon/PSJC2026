/**
 * PSJC2026 動画データ
 * =============================================
 * 動画が公開されたら videoId に YouTube の動画IDを入力してください。
 *
 * 例）URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *     → videoId: "dQw4w9WgXcQ"
 *
 * videoId が空文字 "" のときは「公開準備中」と表示されます。
 *
 * 追加方法:
 * { videoId: "動画ID", player: "HN", team: "チーム名", round: "予選", num: 1 },
 *
 * round: "予選" | "1回戦" | "準決勝" | "決勝"
 * num  : 動画番号（予選は1〜3、決勝Tは1〜6）
 * =============================================
 */

const VIDEOS = [

  // =====================
  // 予選
  // =====================

  // --- チーム名を入力してください ---
  // { videoId: "", player: "HN", team: "チーム名", round: "予選", num: 1 },
  // { videoId: "", player: "HN", team: "チーム名", round: "予選", num: 2 },
  // { videoId: "", player: "HN", team: "チーム名", round: "予選", num: 3 },

  // =====================
  // 決勝トーナメント
  // =====================

  // --- 1回戦 ---
  // { videoId: "", player: "HN", team: "チーム名", round: "1回戦", num: 1 },

  // --- 準決勝 ---
  // { videoId: "", player: "HN", team: "チーム名", round: "準決勝", num: 1 },

  // --- 決勝 ---
  // { videoId: "", player: "HN", team: "チーム名", round: "決勝", num: 1 },

];
