"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  Trash2,
  Star,
  Search,
  Loader2,
  FileX,
  Check,
  StarOff,
} from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  output: string;
  language: string;
  wordCount: number;
  isFavorite: boolean;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  BLOG_POST: "bg-violet-100 text-violet-700",
  SOCIAL_MEDIA: "bg-blue-100 text-blue-700",
  EMAIL: "bg-green-100 text-green-700",
  AD_COPY: "bg-orange-100 text-orange-700",
  PRODUCT_DESCRIPTION: "bg-pink-100 text-pink-700",
  LANDING_PAGE: "bg-cyan-100 text-cyan-700",
  CUSTOM: "bg-gray-100 text-gray-700",
};

const ALL_TYPES = [
  "BLOG_POST",
  "SOCIAL_MEDIA",
  "EMAIL",
  "AD_COPY",
  "PRODUCT_DESCRIPTION",
  "LANDING_PAGE",
  "CUSTOM",
];

export default function HistoryPage() {
  const t = useTranslations("dashboard.history");
  const locale = useLocale();

  const [contents, setContents] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        ...(search ? { search } : {}),
        ...(filterType !== "all" ? { type: filterType } : {}),
        ...(favoritesOnly ? { favorites: "true" } : {}),
      });

      const res = await fetch(`/api/content?${params}`);
      const data = await res.json();
      setContents(data.contents ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType, favoritesOnly]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  // Debounce search
  useEffect(() => {
    setPage(1);
  }, [search, filterType, favoritesOnly]);

  async function handleCopy(content: ContentItem) {
    await navigator.clipboard.writeText(content.output);
    setCopiedId(content.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/content?id=${id}`, { method: "DELETE" });
    setContents((prev) => prev.filter((c) => c.id !== id));
    setTotal((prev) => prev - 1);
  }

  async function handleToggleFavorite(content: ContentItem) {
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: content.id, isFavorite: !content.isFavorite }),
    });
    setContents((prev) =>
      prev.map((c) =>
        c.id === content.id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t("filter_type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all_types")}</SelectItem>
            {ALL_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={favoritesOnly ? "default" : "outline"}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className="gap-2 shrink-0"
        >
          <Star className={`h-4 w-4 ${favoritesOnly ? "fill-current" : ""}`} />
          {t("favorites_only")}
        </Button>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground mb-4">
          {total} result{total !== 1 ? "s" : ""}
        </p>
      )}

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : contents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border rounded-xl bg-muted/20">
          <FileX className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">{t("empty")}</p>
          <p className="text-sm mt-1">{t("empty_subtitle")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contents.map((content) => {
            const isExpanded = expandedId === content.id;
            return (
              <div
                key={content.id}
                className="rounded-xl border bg-card hover:border-violet-200 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <Badge
                      className={`shrink-0 text-xs mt-0.5 ${TYPE_COLORS[content.type] ?? "bg-gray-100 text-gray-700"}`}
                      variant="secondary"
                    >
                      {content.type.replace(/_/g, " ")}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{content.title}</div>
                      <div
                        className="text-xs text-muted-foreground mt-1 cursor-pointer hover:text-foreground transition-colors"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : content.id)
                        }
                      >
                        {isExpanded
                          ? content.output
                          : truncate(content.output, 150)}
                        {content.output.length > 150 && (
                          <span className="text-violet-600 ml-1">
                            {isExpanded ? " Show less" : " Show more"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(content.createdAt)}</span>
                      <span>·</span>
                      <span>{t("words", { count: content.wordCount })}</span>
                      <span>·</span>
                      <span className="uppercase">{content.language}</span>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleToggleFavorite(content)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={content.isFavorite ? t("unfavorite") : t("favorite")}
                      >
                        {content.isFavorite ? (
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(content)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={t("copy")}
                      >
                        {copiedId === content.id ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title={t("delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 15 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center text-sm text-muted-foreground px-3">
            Page {page} of {Math.ceil(total / 15)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 15)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
