import { bitable, FieldType, ITable } from "@lark-base-open/node-sdk";

export default async function main(params: any) {
  try {
    // 获取当前表格
    const table: ITable = await bitable.base.getActiveTable();
    
    // 获取第一列和第二列
    const fields = await table.getFields();
    if (fields.length < 2) {
      await bitable.ui.showToast({
        text: "表格至少需要两列数据！"
      });
      return;
    }
    
    const field1 = fields[0];
    const field2 = fields[1];
    
    // 创建新的拼接列
    const newField = await table.addField({
      type: FieldType.Text,
      name: "拼接结果"
    });
    
    // 获取所有记录
    const records = await table.getRecords();
    
    // 遍历记录进行拼接
    for (const record of records) {
      const value1 = await table.getCellValue(field1.id, record.recordId) || "";
      const value2 = await table.getCellValue(field2.id, record.recordId) || "";
      
      // 拼接并更新到新列
      await table.setCellValue(newField.id, record.recordId, `${value1}_${value2}`);
    }
    
    // 完成提示
    await bitable.ui.showToast({
      text: "数据拼接完成!"
    });
  } catch (error) {
    console.error(error);
    await bitable.ui.showToast({
      text: `发生错误: ${error.message}`
    });
  }
} 