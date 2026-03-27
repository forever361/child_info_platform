-- 幼儿观察记录系统数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS child_observation DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE child_observation;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  openid VARCHAR(64) UNIQUE COMMENT '微信openid',
  name VARCHAR(32) NOT NULL COMMENT '姓名',
  role ENUM('teacher', 'admin') DEFAULT 'teacher' COMMENT '角色: teacher=教师, admin=园长',
  class VARCHAR(32) COMMENT '所带班级',
  avatar_url VARCHAR(255) COMMENT '头像URL',
  created_at DATETIME,
  updated_at DATETIME,
  INDEX idx_openid (openid),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 观察记录表
CREATE TABLE IF NOT EXISTS observations (
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '记录ID',
  user_id INT NOT NULL COMMENT '创建者用户ID',
  record_type ENUM('individual', 'event') NOT NULL COMMENT '记录类型: individual=个体, event=事件',
  target_name VARCHAR(64) NOT NULL COMMENT '观察对象名称（幼儿姓名或事件名）',
  content TEXT COMMENT '观察记录内容',
  analysis TEXT COMMENT '行为分析内容',
  images TEXT COMMENT '图片URL数组(JSON格式)',
  linked_id VARCHAR(32) COMMENT '串联ID（连续观察用）',
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_linked (linked_id),
  INDEX idx_target (target_name),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='观察记录表';

-- 初始管理员账号（园长）
-- 密码: admin123 (实际使用时应加密存储)
-- INSERT INTO users (openid, name, role, class) VALUES ('admin_openid', '园长', 'admin', '全园');
