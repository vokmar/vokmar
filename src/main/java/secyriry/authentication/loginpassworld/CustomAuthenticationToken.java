package secyriry.authentication.loginpassworld;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class CustomAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private String captha;


    public CustomAuthenticationToken(Object principal, Object credentials, String captha) {
        super(principal, credentials);
        this.captha = captha;
        super.setAuthenticated(false);
    }

    public CustomAuthenticationToken(Object principal, Object credentials, String captha, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
        this.captha = captha;
        super.setAuthenticated(false);
    }

    public String getCaptha() {
        return this.captha;
    }


}
