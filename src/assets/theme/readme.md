# 主题文件名定义说明

1. 在`@/typpes/system.d.ts`中的`ThemeMode`type中增加主题标识
2. 文件名必须要与主题标识保持一致（暂时是这样做的，后续加上主题商店后这个规则肯定是会改的）
3. class类名格式为`dbtu-theme-${标识}`, 例如:

    ``` css
    .dbtu-theme-darK {
        --dbtu-font-size: 12px;
        ...
    }
    ```
