<?php

use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware('auth:sanctum')->prefix('chat')->group(function () {
    Route::get('/recent', [ChatController::class, 'getRecentUsersWithMessage']);
    Route::post('/set-active', [ChatController::class, 'setActiveStatus']);
});
// Route::get('chat/users', [ChatController::class, 'getAllUsers']);
Broadcast::routes(['prefix' => 'api', 'middleware' => ['auth:api']]);
