package com.nearbite.service.impl;

import com.nearbite.entity.UserInfo;
import com.nearbite.mapper.UserInfoMapper;
import com.nearbite.service.IUserInfoService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class UserInfoServiceImpl extends ServiceImpl<UserInfoMapper, UserInfo> implements IUserInfoService {

}
