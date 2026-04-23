"use client";

import { useState, useEffect, useCallback } from "react";
import { usePosts, GeneratePostResponse, PostHistory } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Copy, Loader2, Sparkles, ImageOff,
  ChevronDown, ChevronUp, History, ChevronLeft, ChevronRight
} from "lucide-react";

function formatPrice(price: number): string {
  if (!price || price <= 0) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export default function PostsPage() {
  const { generatePost, getHistory, loading, error, historyLoading } = usePosts();

  const [productUrl, setProductUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [result, setResult] = useState<GeneratePostResponse | null>(null);

  const [history, setHistory] = useState<PostHistory[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadHistory = useCallback(async (page: number) => {
    const data = await getHistory(page);
    if (data) {
      setHistory(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    }
  }, []);

  useEffect(() => {
    loadHistory(0);
  }, []);

  const handleGenerate = async () => {
    if (!productUrl.trim()) {
      toast.error("Vui lòng nhập URL sản phẩm");
      return;
    }
    const data = await generatePost(
      productUrl.trim(),
      manualName.trim() || undefined,
      manualPrice.trim() || undefined,
      affiliateUrl.trim() || undefined
    );
    if (data) {
      setResult(data);
      loadHistory(0); // refresh lịch sử
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy bài đăng ${label}!`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          Deal Post Generator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Nhập link sản phẩm Lazada / Tiki / Shopee / TikTok → tự động tạo bài đăng với affiliate link
        </p>
      </div>

      {/* Input card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">URL sản phẩm *</label>
            <Input
              placeholder="https://s.lazada.vn/... hoặc https://tiki.vn/... hoặc https://vt.tiktok.com/..."
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Affiliate URL{" "}
              <span className="text-muted-foreground font-normal">(tuỳ chọn — nếu đã có sẵn)</span>
            </label>
            <Input
              placeholder="Để trống để tự động convert"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowManual(!showManual)}
          >
            {showManual ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Nhập thủ công tên & giá (nếu scrape thất bại)
          </button>

          {showManual && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-1 block">Tên sản phẩm</label>
                <Input
                  placeholder="VD: iPhone 17 Pro Max"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Giá (VD: 37000000)</label>
                <Input
                  placeholder="37000000"
                  value={manualPrice}
                  onChange={(e) => setManualPrice(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
          )}

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang xử lý...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Tạo bài đăng + Affiliate Link</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                Thông tin sản phẩm
                {result.scraped ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Auto scrape ✓</span>
                ) : (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Nhập thủ công</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 items-start">
              {result.productImage ? (
                <img src={result.productImage} alt={result.productName}
                  className="w-20 h-20 object-cover rounded-lg border flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <ImageOff className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-1 min-w-0">
                <p className="font-semibold text-sm leading-snug line-clamp-2">{result.productName}</p>
                <p className="text-lg font-bold text-red-500">{result.productPrice}</p>
                <p className="text-xs text-blue-600 truncate">🔗 {result.linkToShare}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Bài đăng đã tạo — Copy & Share!</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="zalo">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="zalo" className="flex-1">💬 Zalo</TabsTrigger>
                  <TabsTrigger value="facebook" className="flex-1">📘 Facebook</TabsTrigger>
                  <TabsTrigger value="telegram" className="flex-1">✈️ Telegram</TabsTrigger>
                </TabsList>
                {[
                  { key: "zalo", label: "Zalo", content: result.postZalo },
                  { key: "facebook", label: "Facebook", content: result.postFacebook },
                  { key: "telegram", label: "Telegram", content: result.postTelegram },
                ].map(({ key, label, content }) => (
                  <TabsContent key={key} value={key} className="space-y-3">
                    <Textarea value={content} readOnly rows={10} className="text-sm resize-none" />
                    <Button variant="outline" className="w-full" onClick={() => copyToClipboard(content, label)}>
                      <Copy className="w-4 h-4 mr-2" />Copy bài đăng {label}
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {/* Lịch sử */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4" />
            Lịch sử bài đăng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Chưa có bài đăng nào
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  {/* Header row */}
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName}
                        className="w-10 h-10 object-cover rounded-md border flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                        <ImageOff className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.productPrice)} · {formatDate(item.createdAt)}
                      </p>
                    </div>
                    {/* Copy nhanh 3 nút */}
                    <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                        onClick={() => copyToClipboard(item.postZalo, "Zalo")}>
                        💬
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                        onClick={() => copyToClipboard(item.postFacebook, "Facebook")}>
                        📘
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                        onClick={() => copyToClipboard(item.postTelegram, "Telegram")}>
                        ✈️
                      </Button>
                    </div>
                    {expandedId === item.id
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                  </div>

                  {/* Expanded content */}
                  {expandedId === item.id && (
                    <div className="border-t p-3 bg-muted/20">
                      <Tabs defaultValue="zalo">
                        <TabsList className="mb-3">
                          <TabsTrigger value="zalo">💬 Zalo</TabsTrigger>
                          <TabsTrigger value="facebook">📘 Facebook</TabsTrigger>
                          <TabsTrigger value="telegram">✈️ Telegram</TabsTrigger>
                        </TabsList>
                        {[
                          { key: "zalo", label: "Zalo", content: item.postZalo },
                          { key: "facebook", label: "Facebook", content: item.postFacebook },
                          { key: "telegram", label: "Telegram", content: item.postTelegram },
                        ].map(({ key, label, content }) => (
                          <TabsContent key={key} value={key} className="space-y-2">
                            <Textarea value={content} readOnly rows={8} className="text-sm resize-none" />
                            <Button variant="outline" size="sm" className="w-full"
                              onClick={() => copyToClipboard(content, label)}>
                              <Copy className="w-3 h-3 mr-2" />Copy {label}
                            </Button>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 0}
                    onClick={() => loadHistory(currentPage - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Trang {currentPage + 1} / {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1}
                    onClick={() => loadHistory(currentPage + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}