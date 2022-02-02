package com.sweet.home.reply.domain;

import com.sweet.home.comment.domain.Comment;
import com.sweet.home.global.exception.BusinessException;
import com.sweet.home.global.exception.ErrorCode;
import com.sweet.home.member.domain.Member;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Entity
@Getter
@Where(clause = "deleted_at is null and blocked_at is null")
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    private Long id;

    @ManyToOne(targetEntity = Comment.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @ManyToOne(targetEntity = Member.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "content", nullable = false)
    private String content;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "blocked_at")
    private LocalDateTime blockedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Basic(fetch = FetchType.LAZY)
    @Formula("(select count(1) from reply_like rl where rl.reply_id = reply_id)")
    private long totalLikes;

    @Basic(fetch = FetchType.LAZY)
    @Formula("(select count(1) from reply_report rr where rr.reply_id = reply_id)")
    private long totalReports;

    private static final int BLOCK_STANDARD = 5;

    protected Reply() {
    }

    @Builder
    public Reply(Comment comment, Member member, String content) {
        this.comment = comment;
        this.member = member;
        this.content = content;
    }

    public void checkReplyByEmail(String email) {
        if (!member.getEmail().equals(email)) {
            throw new BusinessException(ErrorCode.REPLY_NOT_MATCH_BY_EMAIL);
        }
    }

    public void changeContent(String content) {
        if (!Objects.isNull(content)) {
            this.content = content;
        }
    }

    public void deleteReply() {
        this.deletedAt = LocalDateTime.now();
    }

    public void checkTotalReports() {
        if (this.totalReports >= BLOCK_STANDARD) {
            this.blockedAt = LocalDateTime.now();
        }
    }
}