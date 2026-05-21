'use client'

import React, { useState } from 'react'
import { Rocket, Link2, Zap, BarChart2, Folder, FileText, MessageCircle, CreditCard, ChevronDown, ChevronUp, ExternalLink, DollarSign, Info, Settings } from 'lucide-react'

const COLOR_MAP: Record<string, { fill: string; stroke: string; text: string }> = {
  gray: { fill: '#3f3f46', stroke: '#71717a', text: '#d4d4d8' },
  purple: { fill: '#4c1d95', stroke: '#7c3aed', text: '#ddd6fe' },
  blue: { fill: '#1e3a5f', stroke: '#3b82f6', text: '#bfdbfe' },
  teal: { fill: '#134e4a', stroke: '#14b8a6', text: '#99f6e4' },
  amber: { fill: '#451a03', stroke: '#f59e0b', text: '#fde68a' },
  green: { fill: '#14532d', stroke: '#22c55e', text: '#bbf7d0' },
  pink: { fill: '#4a044e', stroke: '#ec4899', text: '#fbcfe8' },
}

function FlowDiagram({ flow }: { flow: { label: string; sub?: string; color: string }[] }) {
  const n = flow.length, nodeH = 50, gapY = 34, nodeW = 200, cx = 340
  const totalH = n * nodeH + (n - 1) * gapY + 40, x = cx - nodeW / 2
  return (
    <svg width="100%" viewBox={`0 0 680 ${totalH}`} role="img"><title>Flow</title>
      <defs><marker id="farr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs>
      {flow.map((node, i) => {
        const ny = 10 + i * (nodeH + gapY)
        const c = COLOR_MAP[node.color] || COLOR_MAP.gray
        return (
          <g key={i}>
            <rect x={x} y={ny} width={nodeW} height={nodeH} rx={8} fill={c.fill} stroke={c.stroke} strokeWidth={0.5}/>
            {node.sub ? (<><text x={cx} y={ny+16} textAnchor="middle" fontSize={13} fontWeight={500} fill={c.text} fontFamily="sans-serif">{node.label}</text><text x={cx} y={ny+33} textAnchor="middle" fontSize={11} fill={c.text} opacity={0.7} fontFamily="sans-serif">{node.sub}</text></>) : (<text x={cx} y={ny+26} textAnchor="middle" fontSize={13} fontWeight={500} fill={c.text} dominantBaseline="central" fontFamily="sans-serif">{node.label}</text>)}
            {i < n-1 && <line x1={cx} y1={ny+nodeH} x2={cx} y2={ny+nodeH+gapY} stroke="#52525b" strokeWidth={1.5} markerEnd="url(#farr)"/>}
          </g>
        )
      })}
    </svg>
  )
}

type Block = { type: string; text?: string; items?: { step: string; title: string; desc: string }[]; headers?: string[]; rows?: string[][]; flow?: { label: string; sub?: string; color: string }[] }
type Section = { id: string; icon: React.ElementType; color: string; bg: string; title: string; badge?: string; content: Block[] }

const sections: Section[] = [
  {
    id: 'intro',
    icon: Info,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: "Giới thiệu & Cơ chế hoa hồng",
    badge: "Bắt đầu ở đây",
    content: [
      { type: 'note', text: "AffKit là nền tảng quản lý link affiliate cho người Việt Nam. Tạo link, chia sẻ, theo dõi click và thu hoa hồng trong một nơi." },
      { type: 'flow', flow: [{ label: "Bạn có link sản phẩm", sub: "Shopee, Lazada, Tiki...", color: 'gray' }, { label: "Convert sang affiliate link", sub: "Qua AccessTrade API", color: 'purple' }, { label: "Chia sẻ lên mạng xã hội", sub: "Zalo, Telegram, Facebook", color: 'blue' }, { label: "Khách click và mua hàng", sub: "Hệ thống ghi nhận", color: 'teal' }, { label: "Hoa hồng về tài khoản bạn", sub: "Qua AccessTrade", color: 'green' }] },
      { type: 'steps', items: [
        { step: "$", title: "Hoa hồng tính như thế nào?", desc: "Mỗi sàn có tỷ lệ riêng: Shopee ~2-5%, Lazada ~3-8%, Tiki ~2-6%. Tỷ lệ áp dụng trên giá trị đơn hàng được duyệt." },
        { step: "?", title: "Tiền về đâu?", desc: "Hoa hồng về thẳng tài khoản AccessTrade của bạn. Bạn cần điền API key riêng vào AffKit." },
        { step: "~", title: "Bao lâu thì có tiền?", desc: "Thường 30-45 ngày sau khi đơn hoàn thành. Pending → Approved → Thanh toán." },
        { step: "!", title: "Click nhiều mà ít đơn?", desc: "Click là người xem, không phải người mua. Tỷ lệ chuyển đổi thường 1-5%." },
      ] },
    ],
  },
  {
    id: 'quickstart',
    icon: Rocket,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: "Bắt đầu nhanh",
    content: [
      { type: 'flow', flow: [{ label: "Đăng ký tài khoản", sub: "affkit.vn", color: 'gray' }, { label: "Xác nhận email", sub: "Kiểm tra inbox", color: 'purple' }, { label: "Điền API key AccessTrade", sub: "Cài đặt", color: 'blue' }, { label: "Tạo link đầu tiên", sub: "Dán link → Convert", color: 'teal' }, { label: "Chia sẻ và theo dõi", sub: "Zalo, Telegram, Facebook", color: 'green' }] },
      { type: 'steps', items: [
        { step: "1", title: "Đăng ký tài khoản", desc: "Vào affkit.vn → Bắt đầu miễn phí → điền email và mật khẩu → xác nhận email." },
        { step: "2", title: "Kết nối AccessTrade", desc: "Cài đặt → Kết nối AccessTrade → dán API key từ pub2.accesstrade.vn → Lưu. Bước quan trọng để hoa hồng về đúng tài khoản." },
        { step: "3", title: "Tạo link đầu tiên", desc: "Links → + Tạo link mới → dán link sản phẩm → Tạo. AffKit tự convert sang affiliate link." },
        { step: "4", title: "Chia sẻ link", desc: "Copy short link → dán vào Zalo, Telegram, Facebook. Mọi click được ghi lại tự động." },
        { step: "5", title: "Theo dõi kết quả", desc: "Thống kê xem click và nguồn traffic. Hoa hồng xem thu nhập từ AccessTrade." },
      ] },
    ],
  },
  {
    id: 'links',
    icon: Link2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: "Quản lý Link",
    content: [
      { type: 'flow', flow: [{ label: "Dán link sản phẩm", sub: "Bất kỳ sàn nào", color: 'gray' }, { label: "AffKit detect sàn", sub: "Shopee/Lazada/Tiki...", color: 'blue' }, { label: "Tự động convert", sub: "Gọn link + tracking", color: 'purple' }, { label: "Lưu vào danh sách", sub: "Kèm QR code + analytics", color: 'teal' }] },
      { type: 'steps', items: [
        { step: "1", title: "Tạo link mới", desc: "+ Tạo link mới → dán URL gốc → điền tiêu đề (tuỳ chọn) → chọn Campaign → Tạo." },
        { step: "2", title: "Tìm kiếm & lọc", desc: "Dùng ô tìm kiếm lọc theo tiêu đề. Nền tảng được nhận diện tự động." },
        { step: "3", title: "Copy & QR code", desc: "Icon copy để copy short link. Icon QR để tải mã QR dán lên ảnh hoặc in ấn phẩm." },
        { step: "4", title: "Sửa link", desc: "Icon bút chì sửa tiêu đề hoặc campaign. Icon thùng rác xóa (cần xác nhận)." },
        { step: "5", title: "Analytics từng link", desc: "Icon biểu đồ xem click, nguồn traffic và thiết bị của từng link." },
      ] },
      { type: 'note', text: "Plan Free tối đa 30 links. Nâng cấp Pro để không giới hạn." },
    ],
  },
  {
    id: 'campaigns',
    icon: Folder,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: "Chiến dịch (Campaigns)",
    content: [
      { type: 'flow', flow: [{ label: "Tạo chiến dịch", sub: "VD: Flash Sale 6.6", color: 'gray' }, { label: "Gắn link vào chiến dịch", sub: "Khi tạo hoặc sửa link", color: 'pink' }, { label: "Theo dõi hiệu quả", sub: "Tổng click, số link", color: 'teal' }] },
      { type: 'steps', items: [
        { step: "1", title: "Tạo Campaign", desc: "Chiến dịch → + Tạo → đặt tên (VD: Sale 6.6) → ngày bắt đầu/kết thúc → Tạo." },
        { step: "2", title: "Gắn link", desc: "Khi tạo hoặc sửa link, chọn Campaign ở dropdown. Một link chỉ thuộc 1 Campaign." },
        { step: "3", title: "Theo dõi", desc: "Trang Campaign hiển thị tổng click, số link và trạng thái UPCOMING / ACTIVE / ENDED." },
      ] },
    ],
  },
  {
    id: 'analytics',
    icon: BarChart2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: "Thống kê (Analytics)",
    content: [
      { type: 'flow', flow: [{ label: "Người dùng click link", sub: "Zalo, Telegram, FB...", color: 'gray' }, { label: "Hệ thống ghi nhận", sub: "Thiết bị + nguồn", color: 'blue' }, { label: "Hiển thị biểu đồ", sub: "Click theo ngày + nguồn", color: 'teal' }] },
      { type: 'steps', items: [
        { step: "1", title: "Tổng quan", desc: "Thống kê → biểu đồ click theo ngày. Free: 7 ngày. Pro: 90 ngày." },
        { step: "2", title: "Nguồn traffic", desc: "Xem click từ Zalo, Telegram, Facebook, Direct. Biết kênh nào hiệu quả nhất." },
        { step: "3", title: "Thiết bị", desc: "Tỉ lệ Mobile vs Desktop. Nếu phần lớn Mobile, viết nội dung ngắn dễ đọc." },
        { step: "4", title: "Từng link", desc: "Links → icon biểu đồ của link → xem analytics riêng." },
      ] },
    ],
  },
  {
    id: 'posts',
    icon: FileText,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: "Tạo bài đăng Deal",
    content: [
      { type: 'flow', flow: [{ label: "Dán link sản phẩm", sub: "Lazada, Tiki, TikTok Shop", color: 'gray' }, { label: "Scrape tự động", sub: "Tên, giá, ảnh", color: 'amber' }, { label: "Convert affiliate link", sub: "Gắn tracking của bạn", color: 'purple' }, { label: "Sinh 3 bài đăng mẫu", sub: "Zalo / Facebook / Telegram", color: 'teal' }, { label: "Copy và đăng bài", sub: "1-click copy", color: 'green' }] },
      { type: 'steps', items: [
        { step: "1", title: "Nhập link", desc: "Bài đăng Deals → dán link (Lazada, Tiki, TikTok Shop) → Tạo bài." },
        { step: "2", title: "Hệ thống tự lấy thông tin", desc: "AffKit scrape tên, giá, ảnh và tự convert sang affiliate link." },
        { step: "3", title: "Chọn format", desc: "Tab Zalo, Telegram hoặc Facebook. Mỗi kênh có template khác nhau tối ưu sẵn." },
        { step: "4", title: "Copy và đăng", desc: "Copy → dán vào nhóm. Bài đã có đủ thông tin + affiliate link." },
      ] },
      { type: 'note', text: "Hỗ trợ Lazada (s.lazada.vn), Tiki và TikTok Shop. Plan Free: 30 bài/tháng." },
    ],
  },
  {
    id: 'commissions',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: "Theo dõi Hoa hồng",
    content: [
      { type: 'flow', flow: [{ label: "Kết nối API key AT", sub: "Cài đặt → AccessTrade", color: 'gray' }, { label: "Khách mua qua link", sub: "Đơn hoàn thành", color: 'blue' }, { label: "AT ghi nhận", sub: "Trạng thái: Pending", color: 'amber' }, { label: "Duyệt 30-45 ngày", sub: "Trạng thái: Approved", color: 'teal' }, { label: "Thanh toán vào ngân hàng", sub: "Qua ví AccessTrade", color: 'green' }] },
      { type: 'steps', items: [
        { step: "1", title: "Lấy API key", desc: "pub2.accesstrade.vn → Tools → API → Access Key → copy." },
        { step: "2", title: "Dán vào AffKit", desc: "Cài đặt → Kết nối AccessTrade → dán key → Lưu." },
        { step: "3", title: "Xem hoa hồng", desc: "Hoa hồng → xem tổng và danh sách giao dịch." },
        { step: "4", title: "Hiểu trạng thái", desc: "Pending: chờ duyệt | Approved: sẽ thanh toán | Rejected: bị từ chối." },
      ] },
    ],
  },
  {
    id: 'telegram',
    icon: MessageCircle,
    color: 'text-blue-300',
    bg: 'bg-blue-400/10',
    title: "Telegram Bot (@affkit_vn_bot)",
    content: [
      { type: 'flow', flow: [{ label: "Tìm @affkit_vn_bot", sub: "Trên Telegram", color: 'gray' }, { label: "Liên kết tài khoản", sub: "Dùng mã từ AffKit", color: 'blue' }, { label: "Gửi link sản phẩm", sub: "Bot tự convert", color: 'teal' }, { label: "Nhận affiliate link", sub: "Trong vài giây", color: 'green' }] },
      { type: 'steps', items: [
        { step: "1", title: "Bắt đầu", desc: "Mở Telegram → tìm @affkit_vn_bot → nhấn Start." },
        { step: "2", title: "Liên kết tài khoản", desc: "Cài đặt → Liên kết Telegram → lấy mã 6 số → gửi vào bot: /link [mã]." },
        { step: "3", title: "Convert link", desc: "Gửi link sản phẩm → bot trả về affiliate link trong vài giây." },
        { step: "4", title: "Bulk convert", desc: "Gửi nhiều link (mỗi dòng 1 link) → bot convert toàn bộ cùng lúc." },
      ] },
      { type: 'table', headers: ["Lệnh", "Chức năng"], rows: [["/start", "Giới thiệu bot"], ["/help", "Xem hướng dẫn"], ["/link [mã]", "Liên kết tài khoản AffKit"], ["/stats", "Thống kê clicks hôm nay và 7 ngày"], ["/top", "Top 5 link nhiều click nhất"], ["/export", "Xuất links ra file CSV"], ["/upgrade", "Thông tin nâng cấp Pro"], ["Gửi 1 link", "Convert sang affiliate link"], ["Gửi nhiều link", "Bulk convert (mỗi dòng 1 link)"]] },
      { type: 'note', text: "Plan Free: 30 lượt convert/tháng. Pro: không giới hạn." },
    ],
  },
  {
    id: 'accesstrade',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    title: "Kết nối AccessTrade",
    content: [
      { type: 'flow', flow: [{ label: "Đăng ký AccessTrade", sub: "pub2.accesstrade.vn", color: 'gray' }, { label: "Tham gia campaign", sub: "Shopee, Lazada, Tiki...", color: 'amber' }, { label: "Lấy API key", sub: "Tools → API → Access Key", color: 'blue' }, { label: "Dán vào AffKit", sub: "Cài đặt → AccessTrade", color: 'teal' }] },
      { type: 'steps', items: [
        { step: "1", title: "Tại sao cần key riêng?", desc: "Mỗi user có API key riêng. Dùng key của mình thì hoa hồng về đúng tài khoản bạn." },
        { step: "2", title: "Đăng ký AccessTrade", desc: "pub2.accesstrade.vn → đăng ký publisher miễn phí → điền thông tin và website/fanpage." },
        { step: "3", title: "Tham gia campaign", desc: "Campaigns → tìm Shopee, Lazada, Tiki, TikTok Shop → Tham gia → chờ duyệt 1-3 ngày." },
        { step: "4", title: "Lấy và dán key", desc: "pub2.accesstrade.vn → Tools → API → Access Key → copy → dán vào AffKit." },
      ] },
      { type: 'note', text: "Nếu chưa có API key riêng, hoa hồng không về tài khoản bạn." },
    ],
  },
  {
    id: 'settings',
    icon: Settings,
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    title: "Cài đặt tài khoản",
    content: [
      { type: 'steps', items: [
        { step: "1", title: "Cập nhật hồ sơ", desc: "Cài đặt → sửa tên hiển thị → Lưu." },
        { step: "2", title: "Đổi mật khẩu", desc: "Cài đặt → Đổi mật khẩu → nhập mật khẩu hiện tại và mới → Xác nhận." },
        { step: "3", title: "API key AccessTrade", desc: "Cài đặt → Kết nối AccessTrade → dán hoặc xóa key." },
        { step: "4", title: "Thông tin plan", desc: "Cài đặt hiển thị plan hiện tại, ngày bắt đầu và ngày hết hạn." },
        { step: "5", title: "Liên kết Telegram", desc: "Cài đặt → Liên kết Telegram → lấy mã 6 số → gửi /link [mã] vào bot." },
      ] },
    ],
  },
  {
    id: 'billing',
    icon: CreditCard,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: "Nâng cấp Pro",
    content: [
      { type: 'table', headers: ["Tính năng", "Free", "Pro"], rows: [["Số link", "30", "Không giới hạn"], ["Click tracking", "1.000/tháng", "Không giới hạn"], ["Analytics", "7 ngày", "90 ngày"], ["Tạo bài đăng Deal", "30/tháng", "Không giới hạn"], ["Convert Telegram", "30/tháng", "Không giới hạn"], ["Giá", "0đ", "50.000đ/tháng"]] },
      { type: 'flow', flow: [{ label: "Nhấn Nâng cấp Pro", sub: "Trang Thanh toán", color: 'gray' }, { label: "Chuyển khoản Seabank", sub: "0942567631 - PHUNG VAN HUONG", color: 'amber' }, { label: "Nội dung: AFFKIT [email]", sub: "VD: AFFKIT abc@gmail.com", color: 'blue' }, { label: "Gửi ảnh bill cho bot", sub: "Kèm email → @affkit_vn_bot", color: 'teal' }, { label: "Tài khoản lên Pro", sub: "Xử lý trong 5 phút", color: 'green' }] },
      { type: 'note', text: "Gia hạn: làm lại tương tự. Hệ thống tự về Free khi hết hạn. Dữ liệu không bị xóa." },
    ],
  },
  {
    id: 'faq',
    icon: Info,
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    title: "Câu hỏi thường gặp",
    content: [
      { type: 'steps', items: [
        { step: "?", title: "Link không convert được?", desc: "Kiểm tra: (1) Đã điền API key chưa? (2) Đã tham gia campaign chưa? (3) Sàn có được hỗ trợ không?" },
        { step: "?", title: "Shopee chưa hoạt động?", desc: "Shopee chờ AT duyệt campaign. Cần xác minh profile + 5 đơn thành công trên AT." },
        { step: "?", title: "Hoa hồng bao lâu thì về?", desc: "30-45 ngày sau đơn hoàn thành. Tiền vào ví AT, rút về ngân hàng trên trang AT." },
        { step: "?", title: "Click nhiều mà không có đơn?", desc: "Click là xem, không phải mua. Tỷ lệ chuyển đổi 1-5%. Viết nội dung đúng đối tượng." },
        { step: "?", title: "Dữ liệu có bị xóa khi hết Pro?", desc: "Không. Links, analytics giữ nguyên khi về Free." },
        { step: "?", title: "Bot Telegram không reply?", desc: "Kiểm tra đúng @affkit_vn_bot và link bắt đầu https://. Vẫn lỗi → liên hệ @phunghuong1820." },
      ] },
    ],
  },
]

export default function HelpPage() {
  const [openId, setOpenId] = useState<string>('intro')
  const toggle = (id: string) => setOpenId(openId === id ? '' : id)
  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Trung tâm hỗ trợ</h1>
        <p className="text-zinc-400 text-sm">Hướng dẫn sử dụng đầy đủ các tính năng của AffKit</p>
      </div>
      {sections.map((section) => {
        const Icon = section.icon; const isOpen = openId === section.id
        return (
          <div key={section.id} className={`rounded-2xl border transition-colors ${isOpen ? 'border-white/10 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50'}`}>
            <button onClick={() => toggle(section.id)} className="w-full flex items-center justify-between px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}><Icon size={16} className={section.color}/></div>
                <span className="font-semibold text-white text-sm">{section.title}</span>
                {section.badge && <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-medium">{section.badge}</span>}
              </div>
              {isOpen ? <ChevronUp size={16} className="text-zinc-500 shrink-0"/> : <ChevronDown size={16} className="text-zinc-500 shrink-0"/>}
            </button>
            {isOpen && (
              <div className="px-5 pb-5 space-y-5">
                <div className="h-px bg-zinc-800"/>
                {section.content.map((block, bIdx) => {
                  if (block.type === 'flow' && block.flow) return (
                    <div key={bIdx} className="rounded-xl bg-zinc-950/50 border border-zinc-800 p-4">
                      <p className="text-xs text-zinc-500 mb-3 font-medium">Flow nghiệp vụ</p>
                      <FlowDiagram flow={block.flow}/>
                    </div>
                  )
                  if (block.type === 'steps' && block.items) return (
                    <div key={bIdx} className="space-y-3">
                      {block.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex gap-3">
                          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-semibold text-zinc-400">{item.step}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white mb-0.5">{item.title}</p>
                            <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                  if (block.type === 'note' && block.text) return (
                    <div key={bIdx} className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                      <p className="text-xs text-yellow-400 leading-relaxed">{block.text}</p>
                    </div>
                  )
                  if (block.type === 'table' && block.headers && block.rows) return (
                    <div key={bIdx} className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="border-b border-zinc-800">{block.headers.map((h, hi) => <th key={hi} className={`py-2 font-medium text-zinc-400 ${hi === 0 ? 'text-left' : 'text-center'}`}>{h}</th>)}</tr></thead>
                        <tbody>{block.rows.map((row, ri) => <tr key={ri} className="border-b border-zinc-800/50">{row.map((cell, ci) => <td key={ci} className={`py-2.5 ${ci === 0 ? 'text-left text-zinc-300' : 'text-center'} ${ci === 2 ? 'text-violet-400 font-medium' : 'text-zinc-400'}`}>{cell}</td>)}</tr>)}</tbody>
                      </table>
                    </div>
                  )
                  return null
                })}
              </div>
            )}
          </div>
        )
      })}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
        <div>
          <p className="text-white font-semibold text-sm mb-1">Cần hỗ trợ thêm?</p>
          <p className="text-zinc-500 text-xs">Liên hệ trực tiếp qua Telegram, phản hồi trong 5 phút.</p>
        </div>
        <a href="https://t.me/phunghuong1820" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1a8ec4] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0">
          <MessageCircle size={14}/>
          <span>Nhắn Telegram</span>
          <ExternalLink size={12} className="opacity-70"/>
        </a>
      </div>
    </div>
  )
}