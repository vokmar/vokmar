package secyriry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import secyriry.entity.Rol;

public interface RoleRepository extends JpaRepository<Rol, Long> {

}
