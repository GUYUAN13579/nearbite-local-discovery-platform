package com.nearbite.service.impl;

import com.nearbite.entity.BlogComments;
import com.nearbite.mapper.BlogCommentsMapper;
import com.nearbite.service.IBlogCommentsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class BlogCommentsServiceImpl extends ServiceImpl<BlogCommentsMapper, BlogComments> implements IBlogCommentsService {

}
