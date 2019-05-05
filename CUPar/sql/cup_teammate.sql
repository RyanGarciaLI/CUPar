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
-- Table structure for table `teammate`
--

DROP TABLE IF EXISTS `teammate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `teammate` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_sid` char(20) NOT NULL,
  `name` char(20) NOT NULL,
  `college` char(10) NOT NULL,
  `CourseTitle` char(10) NOT NULL,
  `CourseCode` char(10) NOT NULL,
  `Size` tinyint(2) DEFAULT NULL,
  `if_matched` tinyint(4) DEFAULT NULL,
  `remark` char(110) DEFAULT NULL,
  `now_size` tinyint(4) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `sex` char(10) DEFAULT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teammate`
--

LOCK TABLES `teammate` WRITE;
/*!40000 ALTER TABLE `teammate` DISABLE KEYS */;
INSERT INTO `teammate` VALUES (1,'1155107819','Xiao Tianyi','SHHo','CSCI','3100',5,NULL,'hi',1,NULL,'male'),(2,'1155109999','Wei Wang','UC','CSCI','3100',5,NULL,'          Hi!',1,NULL,'male'),(3,'1155107824','Zhao Feng','CC','CSCI','3100',5,NULL,'Yeah!',1,NULL,'female'),(4,'1155107738','Gao Mingyuan','SHHo','CSCI','3100',5,NULL,'       Hi!!!!',1,NULL,'male'),(5,'1155106666','Liu Zhenyuan','Shaw','CSCI','3100',5,NULL,'I\'m the best!',1,NULL,'male'),(6,'1155104321','Jason Wong','CC','CSCI','1000',3,NULL,'Hi!',1,NULL,'male'),(7,'1155223344','Tang William','CC','CSCI','1000',3,NULL,'Hi!',1,NULL,'male');
/*!40000 ALTER TABLE `teammate` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-12 15:25:53
