package com.nearbite.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.nearbite.dto.Result;
import com.nearbite.entity.ShopType;
import com.nearbite.mapper.ShopTypeMapper;
import com.nearbite.service.IShopTypeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static com.nearbite.utils.RedisConstants.CACHE_SHOP_TYPE_KEY;
import static com.nearbite.utils.RedisConstants.CACHE_SHOP_TYPE_TTL;

@Service
public class ShopTypeServiceImpl extends ServiceImpl<ShopTypeMapper, ShopType> implements IShopTypeService {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public Result queryTypeList() {
        String json = stringRedisTemplate.opsForValue().get(CACHE_SHOP_TYPE_KEY);
        if (StrUtil.isNotBlank(json)) {
            return Result.ok(JSONUtil.toList(json, ShopType.class));
        }

        List<ShopType> typeList = query().orderByAsc("sort").list();
        if (typeList == null || typeList.isEmpty()) {
            return Result.ok(typeList);
        }

        stringRedisTemplate.opsForValue().set(
                CACHE_SHOP_TYPE_KEY,
                JSONUtil.toJsonStr(typeList),
                CACHE_SHOP_TYPE_TTL,
                TimeUnit.DAYS
        );
        return Result.ok(typeList);
    }
}
