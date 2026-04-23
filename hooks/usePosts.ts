import { useState } from "react";
import api from "@/lib/api";

export interface GeneratePostResponse {
  productName: string;
  productPrice: string;
  productImage: string;
  linkToShare: string;
  postZalo: string;
  postFacebook: string;
  postTelegram: string;
  scraped: boolean;
}

export interface PostHistory {
  id: number;
  productUrl: string;
  productName: string;
  productPrice: number;
  productImage: string;
  postZalo: string;
  postFacebook: string;
  postTelegram: string;
  createdAt: string;
}

export interface HistoryPage {
  content: PostHistory[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export function usePosts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const generatePost = async (
    productUrl: string,
    productName?: string,
    productPrice?: string,
    affiliateUrl?: string
  ): Promise<GeneratePostResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post("/posts/generate", {
        productUrl,
        productName: productName || "",
        productPrice: productPrice || "",
        affiliateUrl: affiliateUrl || "",
      });
      return data as GeneratePostResponse;
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Lỗi tạo bài đăng");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (page = 0): Promise<HistoryPage | null> => {
    setHistoryLoading(true);
    try {
      const data = await api.get(`/posts/history?page=${page}`);
      return data as HistoryPage;
    } catch {
      return null;
    } finally {
      setHistoryLoading(false);
    }
  };

  return { generatePost, getHistory, loading, error, historyLoading };
}