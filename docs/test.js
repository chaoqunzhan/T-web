function throttlePromises(funcs, max) {
    if (funcs.length === 0) return Promise.resolve([]);
  
    return new Promise((resolve, reject) => {
      const results = new Array(funcs.length); // 保存结果
      let completed = 0; // 已完成任务计数
      let nextIndex = 0; // 下一个要执行的任务索引
  
      // 定义工作函数
      async function work() {
        try {
          while (nextIndex < funcs.length) {
            const index = nextIndex; // 当前任务索引
            const fn = funcs[nextIndex]; // 当前任务函数
            nextIndex++; // 移动到下一个任务
  
            // 执行任务并保存结果
            const res = await fn();
            results[index] = res;
  
            completed++;
            if (completed === funcs.length) {
              resolve(results); // 所有任务完成，返回结果
            }
          }
        } catch (error) {
          reject(error); // 捕获错误并终止
        }
      }
  
      // 启动最多 max 个并发任务
      for (let i = 0; i < Math.min(max, funcs.length); i++) {
        work();
      }
    });
  }