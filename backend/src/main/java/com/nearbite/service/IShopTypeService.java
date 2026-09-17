package com.nearbite.service;

import com.nearbite.entity.ShopType;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nearbite.dto.Result;

public interface IShopTypeService extends IService<ShopType> {

    Result queryTypeList();
}
