package com.sweet.home.article.service;

import com.sweet.home.article.controller.dto.request.ArticleSaveRequest;
import com.sweet.home.article.controller.dto.response.ArticleDetailResponse;
import com.sweet.home.article.controller.dto.response.ArticleLikeResponse;
import com.sweet.home.article.controller.dto.response.ArticleReportsResponse;
import com.sweet.home.article.controller.dto.response.ArticlesLikeResponse;
import com.sweet.home.article.controller.dto.response.ArticlesTitleResponse;
import com.sweet.home.article.domain.Article;
import com.sweet.home.article.domain.ArticleRepository;
import com.sweet.home.board.domain.Board;
import com.sweet.home.board.service.BoardService;
import com.sweet.home.global.exception.BusinessException;
import com.sweet.home.global.exception.ErrorCode;
import com.sweet.home.image.ImageUploader;
import com.sweet.home.member.domain.Member;
import com.sweet.home.member.service.MemberService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final MemberService memberService;
    private final BoardService boardService;
    private final ImageUploader imageUploader;

    public ArticleService(ArticleRepository articleRepository, MemberService memberService,
        BoardService boardService, ImageUploader imageUploader) {
        this.articleRepository = articleRepository;
        this.memberService = memberService;
        this.boardService = boardService;
        this.imageUploader = imageUploader;
    }

    @Transactional
    public Long saveArticle(String email, ArticleSaveRequest request, Long boardId, String url) {
        Member member = memberService.findByEmail(email);
        Board board = boardService.findById(boardId);
        Article article = Article.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .imageUrl(url)
            .member(member)
            .board(board)
            .build();
        return articleRepository.save(article).getId();
    }

    @Transactional(readOnly = true)
    public ArticlesTitleResponse showArticlesByBoard(Long boardId, Pageable pageable) {
        Board board = boardService.findById(boardId);
        Page<Article> articles = articleRepository.findAllByBoardAndBlockedAtIsNull(board, pageable);
        return ArticlesTitleResponse.from(articles);
    }

    @Transactional(readOnly = true)
    public ArticlesLikeResponse showMyArticles(String email, Pageable pageable) {
        Member member = memberService.findByEmail(email);
        Page<Article> articles = articleRepository.findAllByMemberAndBlockedAtIsNull(member, pageable);
        return ArticlesLikeResponse.fromArticle(articles);
    }

    @Transactional(readOnly = true)
    public ArticleReportsResponse showBlockedArticles(Pageable pageable) {
        Page<Article> articles = articleRepository.findAllByBlockedAtIsNotNull(pageable);
        return ArticleReportsResponse.from(articles);
    }

    @Transactional(readOnly = true)
    public List<ArticleLikeResponse> showPopularArticles(Pageable pageable, Long aptId) {
        List<Board> boards = boardService.findAllByApt(aptId);
        LocalDateTime start = LocalDateTime.now().minusHours(24);
        LocalDateTime end = LocalDateTime.now();
        return articleRepository.findAllByBoardInAndBlockedAtIsNullAndCreatedAtBetweenOrderByTotalLikesDesc(boards, start, end,
                pageable).stream()
            .map(ArticleLikeResponse::from)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ArticleLikeResponse> showNewArticles(Pageable pageable, Long aptId) {
        List<Board> boards = boardService.findAllByApt(aptId);
        LocalDateTime start = LocalDateTime.now().minusHours(24);
        LocalDateTime end = LocalDateTime.now();
        return articleRepository.findAllByBoardInAndBlockedAtIsNullAndCreatedAtBetweenOrderByIdDesc(boards, start, end,
                pageable).stream()
            .map(ArticleLikeResponse::from)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Article findById(Long articleId) {
        return articleRepository.findById(articleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND_BY_ID));
    }

    @Transactional(readOnly = true)
    public ArticleDetailResponse showArticle(Long articleId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND_BY_ID));
        return ArticleDetailResponse.from(article);
    }

    @Transactional
    public void updateArticle(String email, ArticleSaveRequest request, Long articleId, String url) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND_BY_ID));
        article.checkArticleByEmail(email);

//        if (Objects.nonNull(article.getImageUrl())) {
//            imageUploader.deleteFile(article.getImageUrl());
//        }

        article.changeTitle(request.getTitle());
        article.changeContent(request.getContent());
        article.changeImageUrl(url);
    }

    @Transactional
    public Article findBlockedArticleById(Long articleId) {
        return articleRepository.findByIdAndBlockedAtIsNotNull(articleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND_BY_ID));
    }

    @Transactional
    public void unblockArticle(Long articleId) {
        Article article = articleRepository.findByIdAndBlockedAtIsNotNull(articleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND_BY_ID));

        article.changeBlockedAt();
    }

    @Transactional
    public void checkReportCounts(Long articleId) {
        Article article = articleRepository.findById(articleId)
            .orElseThrow(() -> new BusinessException(ErrorCode.ARTICLE_NOT_FOUND_BY_ID));
        article.checkTotalReports();
    }
}
