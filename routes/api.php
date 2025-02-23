<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StyleFinderController;
use App\Http\Controllers\TestController;

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
// Real Routes
Route::post('find-styles', [StyleFinderController::class, 'index'])->name('styleFinder');
Route::get('progress/{trackerId}', [StyleFinderController::class, 'checkProgress']);
Route::get('stop/{processId}', [StyleFinderController::class, 'stop'])->name('stop');

// Tests
Route::post('test', [TestController::class, 'index'])->name('test');
Route::get('/test/progress/{trackerId}', [TestController::class, 'checkProgress']);
Route::get('test/stop/{processId}', [TestController::class, 'stop'])->name('stopTest');
