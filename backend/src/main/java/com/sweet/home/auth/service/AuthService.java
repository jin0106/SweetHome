package com.sweet.home.auth.service;

import com.sweet.home.auth.controller.dto.request.LoginRequest;
import com.sweet.home.auth.controller.dto.request.TokenRequest;
import com.sweet.home.auth.controller.dto.response.LoginMemberResponse;
import com.sweet.home.auth.domain.Tokens;
import com.sweet.home.auth.domain.Authority;
import com.sweet.home.auth.domain.RefreshToken;
import com.sweet.home.auth.domain.RefreshTokenRepository;
import com.sweet.home.auth.infrastructure.JwtTokenProvider;
import com.sweet.home.global.exception.BusinessException;
import com.sweet.home.global.exception.ErrorCode;
import com.sweet.home.member.domain.Member;
import com.sweet.home.member.domain.MemberRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(MemberRepository memberRepository, PasswordEncoder passwordEncoder,
        JwtTokenProvider jwtTokenProvider, RefreshTokenRepository refreshTokenRepository) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public LoginMemberResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND_BY_EMAIL));
        member.login(passwordEncoder, request.getPassword());

        Tokens tokens = jwtTokenProvider.createToken(member.getEmail(), member.getAuthority());

        RefreshToken refreshToken = RefreshToken.builder()
            .key(member.getEmail())
            .value(tokens.getRefreshToken())
            .build();

        refreshTokenRepository.save(refreshToken);

        return new LoginMemberResponse(tokens);
    }

    @Transactional
    public LoginMemberResponse reissue(TokenRequest request) {
        // Refresh Token 검증
        if (!jwtTokenProvider.validateRefreshToken(request.getRefreshToken())) {
            throw new BusinessException(ErrorCode.INVALID_NOT_FOUND_REFRESH_TOKEN);
        }

        Authentication authentication = jwtTokenProvider.getAuthentication(request.getAccessToken());

        // 저장소에서 Email 로 refresh token 가져옴
        RefreshToken refreshToken = refreshTokenRepository.findById(authentication.getName())
            .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGOUT_USER_JWT));

        // refresh token 일치하는지 검사
        if (!refreshToken.getValue().equals(request.getRefreshToken())) {
            throw new BusinessException(ErrorCode.INVALID_NOT_MATCH_BY_REFRESH_TOKEN);
        }

        // 새로운 토큰 생성
        Tokens tokens = jwtTokenProvider.createToken(authentication.getName(),
            Authority.convertCodeToAuthority(authentication.getAuthorities().toString().replaceAll("[\\[\\]]", "")));

        // 새로운 refresh token
        refreshToken.updateValue(tokens.getRefreshToken());
        refreshTokenRepository.save(refreshToken);

        return new LoginMemberResponse(tokens);
    }
}
