import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";

import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  commentsSection,
  commentsTitle,
  commentsList,
  commentCard,
  commentMeta,
  commentFormClass,
  commentTextarea,
  commentSubmitBtn,
  loadingClass,
  errorClass,
} from "../styles/common.js";

function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    const getArticle = async () => {
      if (!article) {
        setLoading(true);
      }

      try {
        const res = await axios.get(`http://localhost:3000/user-api/article/${id}`, { withCredentials: true });

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });
  };

  // delete article
  const deleteArticle = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/author-api/articles/${id}/status`,
        { isArticleActive: false },
        { withCredentials: true }
      );

      navigate("/author-profile");
    } catch (err) {
      setError(err.response?.data?.error);
    }
  };

  const editArticle = (articleObj) => {
    navigate(`/edit-article/${articleObj._id}`, { state: articleObj });
  };

  const submitComment = async (e) => {
    e.preventDefault();
    setCommentError("");

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      setCommentError("Please write your view before posting.");
      return;
    }

    try {
      setCommentSubmitting(true);
      const res = await axios.post(
        `http://localhost:3000/user-api/articles/${id}/comments`,
        { comment: trimmedComment },
        { withCredentials: true }
      );

      setArticle(res.data.payload);
      setCommentText("");
    } catch (err) {
      setCommentError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const comments = article?.comments || [];

  const getCommentAuthor = (commentObj) => {
    if (commentObj?.user && typeof commentObj.user === "object") {
      return commentObj.user.firstName || commentObj.user.email || "User";
    }
    return "User";
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}> {article.author?.firstName || "Author"}</div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* Comments */}
      <div className={commentsSection}>
        <h2 className={commentsTitle}>Comments</h2>

        {comments.length === 0 && (
          <p className="text-lg font-bold text-gray-700">No comments yet. Be the first to share your view.</p>
        )}

        {comments.length > 0 && (
          <div className={commentsList}>
            {comments.map((commentObj) => (
              <div key={commentObj._id} className={commentCard}>
                <p className={commentMeta}>
                  {getCommentAuthor(commentObj)}
                  {commentObj.createdAt ? ` • ${formatDate(commentObj.createdAt)}` : ""}
                </p>
                <p className="text-lg text-black font-medium">{commentObj.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user?.role === "USER" && (
          <form className={commentFormClass} onSubmit={submitComment}>
            <label className="text-xl font-black block mb-2" htmlFor="comment">
              Share your view
            </label>
            <textarea
              id="comment"
              rows="4"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={commentTextarea}
              placeholder="Write what you think about this article..."
            />

            {commentError && <p className="text-red-700 font-bold mt-2">{commentError}</p>}

            <button type="submit" className={commentSubmitBtn} disabled={commentSubmitting}>
              {commentSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        )}
      </div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={deleteArticle}>
            Delete
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={articleFooter}>Last updated: {formatDate(article.updatedAt)}</div>
    </div>
  );
}

export default ArticleByID;
