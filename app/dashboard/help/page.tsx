'use client'

import React, { useState } from 'react'
import {
  Rocket, Link2, Zap, BarChart2, Folder, FileText,
  MessageCircle, CreditCard, ChevronDown, ChevronUp, ExternalLink, DollarSign
} from 'lucide-react'

type Block = {
  type: string
  text?: string
  items?: { step: string; title: string; desc: string }[]
  headers?: string[]
  rows?: string[][]
}

type Section = {
  id: string
  icon: React.ElementType
  color: string
  bg: string
  title: string
  content: Block[]
}

const sections: Section[] = [
  {
    id: 'quickstart',
    icon: Rocket,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    title: 'Bắt đầu nhanh',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Đăng ký tài khoản', desc: 'Vào affkit.vn → nhấn "Bắt đầu miễn phí" → điền email và mật khẩu → xác nhận email trong hộp thư.' },
          { step: '2', title: 'Tạo link đầu tiên', desc: 'Vào Dashboard → Links → nhấn "+ Tạo link mới" → dán link gốc → nhấn Tạo. Link rút gọn sẽ có dạng api.affkit.vn/go/xxxxx.' },
          { step: '3', title: 'Copy và chia sẻ', desc: 'Nhấn icon copy bên cạnh short URL → dán vào Zalo, Telegram, Facebook. Mỗi lượt click sẽ được ghi lại tự động.' },
        ],
      },
    ],
  },
  {
    id: 'links',
    icon: Link2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Tạo & quản lý link',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Tạo link mới', desc: 'Nhấn "+ Tạo link mới" → điền URL gốc và tiêu đề (tuỳ chọn) → chọn Campaign nếu muốn gắn nhóm → nhấn Tạo.' },
          { step: '2', title: 'Tìm kiếm & lọc', desc: 'Dùng ô tìm kiếm để lọc theo tiêu đề. Mỗi link hiển thị nền tảng (Shopee, Lazada, Tiki...) được nhận diện tự động.' },
          { step: '3', title: 'Chỉnh sửa link', desc: 'Nhấn icon bút chì để sửa tiêu đề hoặc gắn campaign. Nhấn icon thùng rác để xoá (cần xác nhận lần 2).' },
          { step: '4', title: 'Xem analytics', desc: 'Nhấn icon biểu đồ để xem chi tiết click, nguồn traffic và thiết bị của từng link.' },
        ],
      },
    ],
  },
  {
    id: 'convert',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    title: 'Convert sang affiliate link',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Dán link sản phẩm', desc: 'Vào trang Links → khu vực "Convert sang Affiliate Link" → dán link Shopee, Lazada hoặc Tiki vào ô input.' },
          { step: '2', title: 'Nhấn Convert', desc: 'Nhấn nút Convert hoặc Enter. Hệ thống tự động chuyển sang link affiliate của bạn qua AccessTrade trong vài giây.' },
          { step: '3', title: 'Copy hoặc Lưu', desc: 'Nhấn Copy để copy affiliate link ngay, hoặc nhấn "Lưu vào danh sách" để lưu vào trang Links kèm analytics.' },
        ],
      },
      { type: 'note', text: 'Tính năng này hỗ trợ Tiki, Lazada và TikTok Shop. Shopee sẽ được hỗ trợ khi AccessTrade duyệt campaign.' },
    ],
  },
  {
    id: 'analytics',
    icon: BarChart2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Xem Analytics',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Analytics tổng quan', desc: 'Vào Dashboard → Analytics → xem biểu đồ click theo ngày 7 ngày gần nhất (Pro: 90 ngày).' },
          { step: '2', title: 'Nguồn traffic', desc: 'Xem click đến từ đâu: Zalo, Telegram, Facebook, Direct... Biết kênh nào hiệu quả nhất để tập trung.' },
          { step: '3', title: 'Thiết bị', desc: 'Xem tỉ lệ Mobile vs Desktop để tối ưu nội dung bài đăng cho đúng thiết bị người dùng.' },
          { step: '4', title: 'Analytics từng link', desc: 'Vào Links → nhấn icon biểu đồ của link bất kỳ → xem analytics riêng của link đó.' },
        ],
      },
    ],
  },
  {
    id: 'campaigns',
    icon: Folder,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    title: 'Campaigns',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Tạo Campaign', desc: 'Vào Dashboard → Campaigns → nhấn "+ Tạo Campaign" → đặt tên (ví dụ: "Flash Sale 6.6") → nhấn Tạo.' },
          { step: '2', title: 'Gắn link vào Campaign', desc: 'Khi tạo hoặc sửa link, chọn Campaign ở dropdown. Một link chỉ thuộc 1 Campaign.' },
          { step: '3', title: 'Theo dõi hiệu quả', desc: 'Vào trang Campaign để xem tổng click, số link và trạng thái. Dễ so sánh hiệu quả giữa các chiến dịch.' },
        ],
      },
    ],
  },
  {
    id: 'posts',
    icon: FileText,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: 'Deal Post Generator',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Nhập link sản phẩm', desc: 'Vào Dashboard → Posts → dán link sản phẩm Shopee, Lazada hoặc Tiki → nhấn Lấy thông tin.' },
          { step: '2', title: 'Hệ thống scrape tự động', desc: 'AffKit tự động lấy tên sản phẩm, giá, ảnh và convert sang affiliate link của bạn.' },
          { step: '3', title: 'Chọn định dạng bài đăng', desc: 'Chọn format phù hợp: Zalo, Telegram hoặc Facebook. Mỗi kênh có cách trình bày khác nhau.' },
          { step: '4', title: 'Copy và đăng', desc: 'Nhấn Copy → dán vào nhóm Zalo/Telegram/Facebook. Bài đăng đã có đủ thông tin sản phẩm + affiliate link.' },
        ],
      },
      { type: 'note', text: 'Plan Free không hỗ trợ Deal Post. Nâng cấp Pro để dùng 50 posts/tháng, Business để dùng không giới hạn.' },
    ],
  },
  {
    id: 'telegram',
    icon: MessageCircle,
    color: 'text-blue-300',
    bg: 'bg-blue-400/10',
    title: 'Telegram Bot',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Tìm bot', desc: 'Mở Telegram → tìm kiếm @affkit_vn_bot → nhấn Start.' },
          { step: '2', title: 'Gửi link để convert', desc: 'Gửi link Shopee/Lazada/Tiki vào bot → bot tự động trả về affiliate link trong vài giây.' },
          { step: '3', title: 'Xem thống kê', desc: 'Gửi lệnh /stats để xem tổng click hôm nay và 7 ngày gần nhất ngay trong Telegram.' },
          { step: '4', title: 'Danh sách lệnh', desc: '/start - Bắt đầu | /convert [link] - Convert link | /stats - Xem thống kê | /help - Xem hướng dẫn' },
        ],
      },
    ],
  },
  {
    id: 'commissions',
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Theo dõi Hoa hồng',
    content: [
      {
        type: 'steps',
        items: [
          { step: '1', title: 'Kết nối AccessTrade', desc: 'Vào Dashboard → Cài đặt → mục "Kết nối AccessTrade" → dán API key của bạn từ pub2.accesstrade.vn → nhấn Lưu.' },
          { step: '2', title: 'Lấy API key AccessTrade', desc: 'Đăng nhập pub2.accesstrade.vn → vào Tools → API → Access Key → copy key và dán vào AffKit.' },
          { step: '3', title: 'Xem hoa hồng', desc: 'Vào Dashboard → Hoa hồng → xem tổng hoa hồng tháng này, biểu đồ theo ngày và bảng giao dịch chi tiết.' },
          { step: '4', title: 'Trạng thái giao dịch', desc: 'Pending: đang chờ duyệt | Approved: đã duyệt, sẽ được thanh toán | Rejected: bị từ chối.' },
        ],
      },
      { type: 'note', text: 'Hoa hồng được tính khi người mua hoàn tất đơn hàng qua link affiliate của bạn. Thời gian duyệt thường 30-45 ngày tuỳ merchant.' },
    ],
  },
  {
    id: 'billing',
    icon: CreditCard,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Nâng cấp Plan',
    content: [
      {
        type: 'table',
        headers: ['Tính năng', 'Free', 'Pro', 'Business'],
        rows: [
          ['Số link', '30', 'Không giới hạn', 'Không giới hạn'],
          ['Click tracking', '1.000/tháng', 'Không giới hạn', 'Không giới hạn'],
          ['Analytics', '7 ngày', '90 ngày', 'Không giới hạn'],
          ['Deal Post Generator', '✗', '50 posts/tháng', 'Không giới hạn'],
          ['Telegram Bot', '✗', '✓', '✓'],
          ['Giá', '0đ', '99.000đ/tháng', '299.000đ/tháng'],
        ],
      },
      { type: 'note', text: 'Để nâng cấp, vào Dashboard → Billing → nhấn "Nâng cấp Pro" → liên hệ qua Telegram để thanh toán thủ công trong 5 phút.' },
    ],
  },
]

export default function HelpPage() {
  const [openId, setOpenId] = useState<string>('quickstart')
  const toggle = (id: string) => setOpenId(openId === id ? '' : id)

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Trung tâm hỗ trợ</h1>
        <p className="text-zinc-400 text-sm">Hướng dẫn sử dụng đầy đủ các tính năng của AffKit</p>
      </div>

      {sections.map((section) => {
        const Icon = section.icon
        const isOpen = openId === section.id
        return (
          <div
            key={section.id}
            className={`rounded-2xl border transition-colors ${isOpen ? 'border-white/10 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/50'}`}
          >
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${section.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={section.color} />
                </div>
                <span className="font-semibold text-white text-sm">{section.title}</span>
              </div>
              {isOpen ? <ChevronUp size={16} className="text-zinc-500 shrink-0" /> : <ChevronDown size={16} className="text-zinc-500 shrink-0" />}
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-4">
                <div className="h-px bg-zinc-800" />
                {section.content.map((block, bi) => {
                  if (block.type === 'steps' && block.items) {
                    return (
                      <div key={bi} className="space-y-3">
                        {block.items.map((item, ii) => (
                          <div key={ii} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
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
                  }
                  if (block.type === 'note' && block.text) {
                    return (
                      <div key={bi} className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                        <p className="text-xs text-yellow-400 leading-relaxed">{block.text}</p>
                      </div>
                    )
                  }
                  if (block.type === 'table' && block.headers && block.rows) {
                    return (
                      <div key={bi} className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-zinc-800">
                              {block.headers.map((h, hi) => (
                                <th key={hi} className={`py-2 font-medium text-zinc-400 ${hi === 0 ? 'text-left' : 'text-center'}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-zinc-800/50">
                                {row.map((cell, ci) => (
                                  <td key={ci} className={`py-2.5 ${ci === 0 ? 'text-left text-zinc-300' : 'text-center'} ${cell === '✓' ? 'text-emerald-400' : cell === '✗' ? 'text-zinc-600' : ci === 2 ? 'text-violet-400 font-medium' : 'text-zinc-400'}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  }
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
        <a
          href="https://t.me/phunghuong1820"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1a8ec4] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <MessageCircle size={14} />
          <span>Nhắn Telegram</span>
          <ExternalLink size={12} className="opacity-70" />
        </a>
      </div>
    </div>
  )
}