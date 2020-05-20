package ru.boq.vokmar.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import secyriry.authentication.CustomAuthencationProvider;
import secyriry.authentication.VokmarAuthenticationSuccessHandler;
import secyriry.authentication.filter.CustomAuthenticationFailureHandler;
import secyriry.authentication.loginpassworld.*;
import secyriry.service.EncodingFilter;
import secyriry.service.UserService;


import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity(debug = true)
@ComponentScan(basePackages = {"secyriry"})
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired(required = true)
    private UserService userServices;

    @Autowired
    private CustomAuthencationProvider cap;


    public WebSecurityConfig() {
        super();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        //web.ignoring().antMatchers(HttpMethod.GET, "/ajax");
    }

    @Override
    protected void configure(final HttpSecurity http) throws Exception {

//        http
//
//                .addFilterBefore(authenticationFilter(), UsernamePasswordAuthenticationFilter.class);
//                http.authorizeRequests()
//                .antMatchers("/admin/**").access("hasRole('ADMIN')")
//                .antMatchers("/ok/**").access("hasRole('USER')")
//                .antMatchers("/**").permitAll()
//                .antMatchers("/resources/**", "/css/**", "/js/**", "/images/**").permitAll()
//                .and()
//              //  .exceptionHandling().accessDeniedHandler(accessDeniedHandler())
//               // .and()
//                .exceptionHandling().authenticationEntryPoint(new CustomHttp403ForbiddenEntryPoint())
//                        .and()
//
//
//                .logout().deleteCookies("JSESSIONID")
//                .and().logout().invalidateHttpSession(true)
//                .and().logout().logoutSuccessUrl("/").permitAll()
//                .and().logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout"))// Выход для ссылки
//                //.and().exceptionHandling().accessDeniedPage("/login.html")
//
//       .and()
//                .sessionManagement()
//                .invalidSessionUrl("/")
//                .maximumSessions(1)
//                .maxSessionsPreventsLogin(true)
//                .sessionRegistry(sessionRegistry());


        http
                .csrf()
                .and()
                .addFilterBefore(authenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers("/resources/**", "/css/**", "/js/**", "/images/**").permitAll()
                .antMatchers("/expired").permitAll()
                .antMatchers("/user/*").authenticated()
                //.antMatchers("/admin/**").authenticated()
                //.antMatchers("/ok/*").hasAnyAuthority("ADMIN","USER")
                .antMatchers("/admin/**").hasAuthority("ADMIN")
                //.and()
                //.formLogin().loginPage("/login.html")
                .and()
                ///.logout()
                //.logoutUrl("/logout");
                .logout().deleteCookies("JSESSIONID")
                .and().logout().invalidateHttpSession(true)
                .and().logout().logoutSuccessUrl("/").permitAll()
                .and().logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout"))// Выход для ссылки


                .and()
                .exceptionHandling().accessDeniedHandler(accessDeniedHandler())
                .and()
                .exceptionHandling().authenticationEntryPoint(new CustomHttp403ForbiddenEntryPoint());

        http
                .sessionManagement()
                .sessionFixation().migrateSession() // Защита от атаки фиксация сеанса
                .invalidSessionUrl("/login.html")
                .maximumSessions(1)
                .expiredUrl("/login.html")
                .maxSessionsPreventsLogin(true)
                .sessionRegistry(sessionRegistry());

    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return new CustomAccessDeniedHandler();
    }


    // @Override
    // protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
    //auth.userDetailsService(userServices).passwordEncoder(bCryptPasswordEncoder()); - вход стандартный
    //auth.authenticationProvider(cap); //Собственный провайдер аудентификации
    //auth.authenticationProvider(authProvider()); // Собственный провайдер
    //}

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authProvider());
    }

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public AuthenticationProvider authProvider() {
        CustomUserDetailsAuthenticationProvider provider
                = new CustomUserDetailsAuthenticationProvider(passwordEncoder(), userDetailsService);
        return provider;
    }


    // Фильр шибки - не запустился
    @Bean
    public AuthenticationFailureHandler customAuthenticationFailureHandler() {
        return new CustomAuthenticationFailureHandler();
    }

    @Bean
    public AuthenticationSuccessHandler myAuthenticationSuccessHandler() {
        return new VokmarAuthenticationSuccessHandler();
    }

    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    @Bean
    public CustomAuthenticationFilte authenticationFilter() throws Exception {
        CustomAuthenticationFilte filter = new CustomAuthenticationFilte();
        filter.setAuthenticationManager(authenticationManagerBean());
        filter.setAuthenticationFailureHandler(customAuthenticationFailureHandler());
        filter.setAuthenticationSuccessHandler(myAuthenticationSuccessHandler());
        filter.setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/login.html", "POST"));


        return filter;
    }

    public SimpleUrlAuthenticationFailureHandler failureHandler() {
        return new SimpleUrlAuthenticationFailureHandler("/login?error=true");
    }


}
