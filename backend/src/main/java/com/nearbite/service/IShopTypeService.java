package com.nearbite.service;

import com.nearbite.entity.ShopType;
import com.baomidou.mybatisplus.extension.service.IService;
import com.nearbite.dto.Result;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
public interface IShopTypeService extends IService<ShopType> {

    Result queryTypeList();
}
