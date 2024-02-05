package mika.pawel.diabetesTreatmentReporter.dao;

import java.util.List;
import mika.pawel.diabetesTreatmentReporter.model.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<ReportEntity, Integer> {
  List<ReportEntity> findAllByUserIdInAndDeletedFalseOrderByIdDesc(List<Integer> ids);
  List<ReportEntity> findAllByUserIdAndDeletedFalseOrderByIdDesc(Integer id);
  List<ReportEntity> findAllByUserIdAndYearAndMonthAndDeletedFalse(Integer id, Integer year, Integer month);
}
