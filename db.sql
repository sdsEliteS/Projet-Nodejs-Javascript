-- MySQL Script generated by MySQL Workbench
-- mar. 28 sept. 2021 14:15:41
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pseudo` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `isAdmin` TINYINT NOT NULL DEFAULT 0,
  `isVerified` TINYINT NOT NULL DEFAULT 0,
  `isBan` TINYINT NOT NULL DEFAULT 0,
  `avatar` VARCHAR(255) NOT NULL DEFAULT,
  `address` VARCHAR(255) NOT NULL,
  `telephone` VARCHAR(255) NOT NULL,
  `birthday` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UserPseudo_UNIQUE` (`pseudo` ASC) VISIBLE,
  UNIQUE INDEX `Id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Article`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Article` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `recommandation` LONGTEXT NOT NULL,
  `date` DATE NOT NULL,
  `dateEdit` DATE NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `subdescription` VARCHAR(255) NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Article_User1_idx` (`author_id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `author_id` INT NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `ref_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Comment_Article1_idx` (`ref_id` ASC) VISIBLE,
  INDEX `fk_Comment_User1_idx` (`author_id` ASC) VISIBLE,
  CONSTRAINT `fk_Comment_Article1`
    FOREIGN KEY (`ref_id`)
    REFERENCES `mydb`.`Article` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Comment_User1`
    FOREIGN KEY (`author_id`)
    REFERENCES `mydb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nom` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `sujet` VARCHAR(255) NOT NULL,
  `message` LONGTEXT NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


/* Autogénérer un Utilisateur */
insert into User (pseudo, email, password, address, telephone, birthday, isAdmin, isVerified)
values ('Steven', 'dossantos.steven72190@gmail.com', '$2b$10$/rnslB/l8JC01uGtEuCc5.9LpLxzaru.68nB2z84ilvF4OqDJCpBu', '327 Route de Beauchêne La Bellangerie', '0661538718', '1989-06-28', 1, 1);