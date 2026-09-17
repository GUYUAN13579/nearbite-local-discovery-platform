package com.nearbite.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nearbite.dto.LoginFormDTO;
import com.nearbite.dto.Result;
import com.nearbite.entity.User;

import javax.servlet.http.HttpSession;

public interface IUserService extends IService<User> {

    Result sendCode(String phone, HttpSession session);

    Result login(LoginFormDTO loginForm, HttpSession session);

    Result logout(String token);

    Result sign();

    Result signCount();

}
