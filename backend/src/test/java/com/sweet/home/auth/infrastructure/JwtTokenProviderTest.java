package com.sweet.home.auth.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertAll;

import com.sweet.home.auth.controller.dto.response.TokenResponse;
import com.sweet.home.auth.domain.Authority;
import com.sweet.home.member.util.MemberFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class JwtTokenProviderTest {

    private String headerType = "headerType";
    private String issuer = "issuer";
    private String secret = "dGVzdF90ZXN0X3Rlc3RfdGVzdF90ZXN0X3Rlc3RfdGVzdF90ZXN0X3Rlc3RfdGVzdF90ZXN0X3Rlc3RfdGVzdF8K";
    private long accessTime = 100000L;
    private long refreshTime = 604800000L;
    private Authority authority = Authority.ROLE_REGULAR_MEMBER;

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setup() {
        jwtTokenProvider = new JwtTokenProvider(headerType, issuer, secret, accessTime, refreshTime);
    }

    @Test
    @DisplayName("토큰을 생성할 수 있다.")
    void createTokenTest() {
        // given
        String subject = MemberFixture.EMAIL;

        // when
        TokenResponse result = jwtTokenProvider.createToken(subject, authority);

        // then
        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("생성된 토큰에서 subject값을 반환할 수 있다.")
    void resolveTokenTest() {
        // given
        String subject = MemberFixture.EMAIL;
        TokenResponse accessToken = jwtTokenProvider.createToken(subject, authority);

        // when
        Authentication result = jwtTokenProvider.resolveAccessToken(accessToken.getAccessToken());

        // then
        assertAll(
            () -> assertThat(result.getPrincipal()).isEqualTo(subject),
            () -> assertThat(result.getCredentials()).isEqualTo(accessToken.getAccessToken()),
            () -> assertThat(result.getAuthorities().size()).isEqualTo(1)
        );
    }
}