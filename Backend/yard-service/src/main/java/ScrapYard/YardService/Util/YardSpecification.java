package ScrapYard.YardService.Util;

import ScrapYard.YardService.Entity.YardEntity;
import ScrapYard.YardService.Enum.IndianCity;
import ScrapYard.YardService.Enum.IndianStates;
import ScrapYard.YardService.Enum.Status;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class YardSpecification {

    public static Specification<YardEntity> hasStatus(Status status) {
        return (root, query, cb) ->
                cb.equal(root.get("status"), status);
    }

    public static Specification<YardEntity> findByFilter(
            String name,
            IndianCity city,
            IndianStates state,
            String pincode) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isEmpty()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + name.toLowerCase() + "%"
                        )
                );
            }

            if (city != null) {
                predicates.add(
                        criteriaBuilder.equal(root.get("city"), city)
                );
            }

            if (state != null) {
                predicates.add(
                        criteriaBuilder.equal(root.get("state"), state)
                );
            }

            if (pincode != null && !pincode.isEmpty()) {
                predicates.add(
                        criteriaBuilder.equal(root.get("pincode"), pincode)
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }


}