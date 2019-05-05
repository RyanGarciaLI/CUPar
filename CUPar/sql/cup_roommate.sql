-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: cup
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `roommate`
--

DROP TABLE IF EXISTS `roommate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `roommate` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_sid` char(20) NOT NULL,
  `name` char(20) NOT NULL,
  `college` char(10) NOT NULL,
  `hall` char(10) DEFAULT NULL,
  `remark` char(110) DEFAULT NULL,
  `sleep_time_start` smallint(100) DEFAULT NULL,
  `sleep_time_end` smallint(100) DEFAULT NULL,
  `if_matched` tinyint(4) DEFAULT NULL,
  `user_b_id` char(20) DEFAULT NULL,
  `sex` char(10) DEFAULT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roommate`
--

LOCK TABLES `roommate` WRITE;
/*!40000 ALTER TABLE `roommate` DISABLE KEYS */;
INSERT INTO `roommate` VALUES (5,'1155107819','Xiao Tianyi','SHHo','LQW','Nice to meet you!',130,205,1,NULL,'male'),(8,'1155109999','Luo Lu','SHHo','LQW','Nice to Meet You！',115,200,1,NULL,'male'),(9,'1155888888','Someone','WYS','WYS','HI！',120,210,0,NULL,'female'),(10,'1155107718','Wei Wang','CC','YL','I\'m DIDI!!!',100,190,0,NULL,'male'),(11,'1155107777','Lucy','MC','MC','Hi',110,200,0,NULL,'female'),(12,'1155104321','Charlie','MC','MC','Hi',110,200,0,NULL,'female'),(13,'1155223344','Tester3','MC','MC','',140,205,0,NULL,'female');
/*!40000 ALTER TABLE `roommate` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-12 15:25:54
