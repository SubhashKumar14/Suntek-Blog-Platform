// Shared style tokens for consistent UI across auth, profile, and article pages.

// Layout
export const pageBackground = "bg-white min-h-screen";
export const pageWrapper = "max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16";
export const section = "mb-12 sm:mb-14";

// Cards
export const cardClass = "bg-[#f5f5f7] rounded-2xl p-6 sm:p-7 hover:bg-[#ebebf0] transition-colors duration-200 cursor-pointer";

// Typography
export const pageTitleClass = "text-3xl sm:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-2";
export const headingClass = "text-2xl font-bold text-[#1d1d1f] tracking-tight";
export const subHeadingClass = "text-lg font-semibold text-[#1d1d1f] tracking-tight";
export const bodyText = "text-[#6e6e73] leading-relaxed";
export const mutedText = "text-sm text-[#a1a1a6]";
export const linkClass = "text-[#0066cc] hover:text-[#004499] transition-colors";

// Buttons
export const primaryBtn = "bg-[#0066cc] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#004499] transition-colors cursor-pointer text-sm tracking-tight";
export const secondaryBtn = "border border-[#d2d2d7] text-[#1d1d1f] font-medium px-5 py-2 rounded-full hover:bg-[#f5f5f7] transition-colors cursor-pointer text-sm";
export const ghostBtn = "text-[#0066cc] font-medium hover:text-[#004499] transition-colors cursor-pointer text-sm";

// Forms
export const formCard = "bg-[#f5f5f7] rounded-2xl p-6 sm:p-10 max-w-md mx-auto";
export const formTitle = "text-2xl font-bold text-[#1d1d1f] tracking-tight text-center mb-7";
export const labelClass = "text-xs font-medium text-[#6e6e73] mb-1.5 block";
export const inputClass = "w-full bg-white border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition";
export const formGroup = "mb-4";
export const submitBtn = "w-full bg-[#0066cc] text-white font-semibold py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer mt-2 text-sm tracking-tight disabled:opacity-60 disabled:cursor-not-allowed";

// Navbar
export const navbarClass = "bg-white/85 backdrop-blur-xl backdrop-saturate-150 border-b border-[#e8e8ed] px-4 sm:px-8 h-[52px] flex items-center sticky top-0 z-50";
export const navContainerClass = "max-w-5xl mx-auto w-full flex items-center justify-between";
export const navBrandClass = "text-base font-semibold text-[#1d1d1f] tracking-tight";
export const navLinksClass = "flex items-center gap-4 sm:gap-7";
export const navLinkClass = "text-[0.8rem] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors font-normal";
export const navLinkActiveClass = "text-[0.8rem] text-[#0066cc] font-medium";

// Article/Blog
export const articleGrid = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
export const articleCardClass = "bg-[#f5f5f7] border border-[#e8e8ed] rounded-2xl p-6 sm:p-7 hover:bg-[#ebebf0] transition-colors duration-200 flex flex-col gap-2.5 cursor-pointer";
export const articleTitle = "text-base font-semibold text-[#1d1d1f] leading-snug tracking-tight";
export const articleExcerpt = "text-sm text-[#6e6e73] leading-relaxed";
export const articleMeta = "text-xs text-[#a1a1a6]";
export const articleBody = "text-[#6e6e73] leading-[1.85] text-[0.95rem] max-w-2xl";
export const timestampClass = "text-xs text-[#a1a1a6] flex items-center gap-1.5";
export const tagClass = "text-[0.65rem] font-semibold text-[#0066cc] uppercase tracking-widest w-fit";

// Feedback
export const errorClass = "bg-[#ff3b30]/[0.06] text-[#cc2f26] border border-[#ff3b30]/[0.18] rounded-xl px-4 py-3 text-sm";
export const successClass = "bg-[#34c759]/[0.07] text-[#248a3d] border border-[#34c759]/20 rounded-xl px-4 py-3 text-sm";
export const loadingClass = "text-[#0066cc]/60 text-sm animate-pulse text-center py-10";
export const emptyStateClass = "text-center text-[#a1a1a6] py-16 text-sm";

// Divider
export const divider = "border-t border-[#e8e8ed] my-10";

// Home
export const heroSection = "max-w-3xl mx-auto text-center py-16 sm:py-24";
export const heroTitle = "text-4xl sm:text-6xl font-bold tracking-tight text-[#1d1d1f] mb-4";
export const heroSubtitle = "text-base sm:text-lg text-[#6e6e73] leading-relaxed";

// Author profile shell/tabs
export const profileShell = "bg-[#fbfbfd] border border-[#e8e8ed] rounded-2xl max-w-5xl mx-auto mt-6 p-4 sm:p-6";
export const profileTabs = "flex flex-wrap gap-3 border-b border-[#e8e8ed] pb-4";
export const profileTabBase = "px-4 py-2 rounded-full text-sm font-medium transition-colors";
export const profileTabActive = "bg-[#0066cc] text-white";
export const profileTabInactive = "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#ebebf0]";
export const profileOutletWrap = "pt-6";

// Compatibility exports used by current components
export const articlePageWrapper = "max-w-4xl mx-auto px-4 py-10";
export const articleHeader = "mb-6";
export const articleCategory = tagClass;
export const articleMainTitle = "text-3xl font-bold text-[#1d1d1f] tracking-tight mt-2";
export const articleAuthorRow = "flex items-center justify-between text-sm text-[#6e6e73] mt-3";
export const authorInfo = "font-medium text-[#1d1d1f]";
export const articleContent = articleBody;
export const articleFooter = "text-xs text-[#a1a1a6] mt-8";
export const articleActions = "flex gap-3 mt-6";
export const editBtn = secondaryBtn;
export const deleteBtn = "bg-[#ff3b30] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#d92f26] transition-colors cursor-pointer text-sm";

// Comments
export const commentsSection = "mt-12 border-t border-[#e8e8ed] pt-8";
export const commentsTitle = "text-xl font-bold text-[#1d1d1f] tracking-tight mb-6";
export const commentsList = "space-y-5";
export const commentCard = "bg-[#f5f5f7] rounded-2xl p-5";
export const commentMeta = "text-xs text-[#a1a1a6] mb-2";
export const commentFormClass = "mt-8 bg-[#f5f5f7] rounded-2xl p-6";
export const commentTextarea = "w-full bg-white border border-[#d2d2d7] rounded-xl px-4 py-3 text-[#1d1d1f] text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition resize-none";
export const commentSubmitBtn = "mt-3 bg-[#0066cc] text-white font-semibold px-5 py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed";

// Site Footer
export const siteFooterClass = "bg-[#fbfbfd] border-t border-[#e8e8ed] py-8 mt-auto w-full";
export const siteFooterContainer = "max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.8rem] text-[#6e6e73]";
export const siteFooterLink = "hover:text-[#1d1d1f] transition-colors font-medium";

