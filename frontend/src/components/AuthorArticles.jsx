import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  ghostBtn,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleGrid,
} from "../styles/common";

function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`}/author-api/articles/${user._id}`, { withCredentials: true });

        setArticles(res.data.payload);
      } catch (err) {
        console.log(err);
        setError(err.response?.data?.error || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  if (articles.length === 0) {
    return <div className={emptyStateClass}>You haven't published any articles yet.</div>;
  }

  return (
    <div className={articleGrid}>
      {articles.map((article) => (
        <div key={article._id} className={`${articleCardClass} flex flex-col h-full`}>
          <div className="flex flex-col gap-2 h-full">
            <p className="text-[0.65rem] font-semibold text-[#0066cc] uppercase tracking-widest w-fit">{article.category}</p>
            <p className={articleTitle}>{article.title}</p>
            <p className={`${articleExcerpt} flex-grow`}>{article.content.slice(0, 60)}...</p>
            <p className={articleMeta}>{formatDate(article.createdAt)}</p>
          </div>

          <button className={`${ghostBtn} w-fit mt-3 px-0`} onClick={() => openArticle(article)}>
            Read Article →
          </button>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticles;
