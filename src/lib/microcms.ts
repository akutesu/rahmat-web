import { createClient } from "microcms-js-sdk";
import type { MicroCMSQueries } from "microcms-js-sdk";

// 環境変数にAPIキーがあるかチェック
const hasApiKey = import.meta.env.MICROCMS_SERVICE_DOMAIN && import.meta.env.MICROCMS_API_KEY;

export const client = hasApiKey
  ? createClient({
      serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
      apiKey: import.meta.env.MICROCMS_API_KEY,
    })
  : null;

// お知らせの型定義
export type News = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  category: { id: string; name: string; color?: string }[];
};

export type NewsResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: News[];
};

// ダミーデータ（APIキーがない環境でも開発・確認できるように）
export const DUMMY_NEWS: News[] = [
  {
    id: "news-1",
    createdAt: "2026-03-12T00:00:00.000Z",
    updatedAt: "2026-03-12T00:00:00.000Z",
    publishedAt: "2026-03-12T00:00:00.000Z",
    revisedAt: "2026-03-12T00:00:00.000Z",
    title: "ホームページをリニューアルしました",
    content: "<p>ラフマット株式会社（S-GROUP）の公式ホームページを新たに公開・リニューアルいたしました。<br>デザインを一新し、皆様により分かりやすく最新の情報や採用情報をお届けしてまいります。</p><p>今後ともよろしくお願い申し上げます。</p>",
    category: [{ id: "cat-1", name: "お知らせ", color: "surface-100" }]
  },
  {
    id: "news-2",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    publishedAt: "2026-03-01T00:00:00.000Z",
    revisedAt: "2026-03-01T00:00:00.000Z",
    title: "春季の新規採用に関するお知らせ",
    content: "<p>新しい季節に向けて、警備スタッフの新規採用を強化しております。<br>未経験の方でも安心してスタートできるよう、充実した研修制度をご用意しております。<br>詳細は採用情報ページ、またはお問い合わせフォームよりお気軽にご相談ください。</p>",
    category: [{ id: "cat-2", name: "採用", color: "primary-100" }]
  }
];

// APIの呼び出しを隠蔽する関数（一覧取得）
export const getNewsList = async (queries?: MicroCMSQueries): Promise<NewsResponse> => {
  if (client) {
    try {
      return await client.get<NewsResponse>({ endpoint: "news", queries });
    } catch (e) {
      console.warn("Failed to fetch from microCMS, using dummy data.", e);
    }
  }
  // APIキーがない、または取得失敗時はダミーデータを返す
  return {
    contents: DUMMY_NEWS,
    totalCount: DUMMY_NEWS.length,
    offset: 0,
    limit: queries?.limit || 10,
  };
};

// 詳細取得
export const getNewsDetail = async (contentId: string, queries?: MicroCMSQueries): Promise<News> => {
  if (client) {
    try {
      return await client.getListDetail<News>({ endpoint: "news", contentId, queries });
    } catch (e) {
      console.warn(`Failed to fetch news detail for ${contentId}, using dummy data.`);
    }
  }
  // ダミーデータを返す
  const news = DUMMY_NEWS.find(n => n.id === contentId);
  if (!news) throw new Error("News not found");
  return news;
};
