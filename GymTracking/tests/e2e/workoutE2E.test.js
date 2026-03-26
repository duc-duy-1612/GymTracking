const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

// Helper to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runWorkoutE2ETest() {
    // Requires chromedriver to be installed and available in PATH
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        console.log('Bắt đầu bài Test E2E cho luồng Workout...');
        
        // 1. Mở trang Workout
        await driver.get('http://localhost:5173/workout'); // Port React có thể là 5173 (Vite) hoặc 3000 (CRA)
        
        // Insert token nếu trang yêu cầu authentication
        await driver.executeScript(`window.localStorage.setItem('token', 'MOCK_TEST_TOKEN');`);
        await driver.navigate().refresh();

        // 2. Chờ Load Danh sách bài tập
        console.log('Chờ tải danh sách bài tập...');
        await driver.wait(until.elementLocated(By.className('workout-list')), 5000);
        console.log('Đã load được danh sách bài tập!');
        await sleep(1000);

        // 3. Bấm chọn bài
        const exerciseItems = await driver.findElements(By.className('workout-list-item'));
        if (exerciseItems.length > 0) {
            await exerciseItems[0].click(); // Chọn bài đầu tiên
            console.log('Đã bấm chọn bài tập đầu tiên.');
        }

        // 4. Nhấn "Bắt đầu Set"
        const startSetBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Bắt đầu Set')]")), 5000);
        await startSetBtn.click();
        console.log('Đã nhấn Bắt đầu Set.');
        
        await sleep(2000); // Simulate workout time
        
        // Nhấn hoàn thành set
        const finishSetBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Hoàn thành set')]")), 5000);
        await finishSetBtn.click();
        console.log('Đã nhấn Hoàn thành Set.');
        await sleep(1000);
        
        // Bấm hoàn thành bài tập (nếu cần bỏ qua các set còn lại)
        const finishExerciseBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Hoàn thành bài tập')]")), 5000);
        await finishExerciseBtn.click();
        console.log('Đã nhấn Hoàn thành bài tập.');
        await sleep(1000);

        // 5. Bấm "Hoàn thành buổi tập"
        const completeWorkoutBtn = await driver.wait(until.elementLocated(By.className('workout-complete-btn')), 5000);
        await completeWorkoutBtn.click();
        console.log('Đã nhấn Hoàn thành buổi tập.');

        // 6. Xác nhận thông báo thành công (toast)
        // Tìm element chứa text thông báo hoàn thành
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Đã hoàn thành buổi tập')]")), 5000);
        console.log('Đã thấy thông báo: Hoàn thành buổi tập thành công!');
        
        assert.ok(true);
        console.log('==== TEST PASSED ====');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await sleep(3000);
        await driver.quit();
    }
}

runWorkoutE2ETest();
