extern crate core;
use core::arch::x86_64::*;
use std::slice;

#[no_mangle]
pub fn add(first: i32, second:i32) -> i32 {
 first + second
}

#[no_mangle] 
pub fn vadd(dataA: *const i32, dataB: *const i32, dataC: *mut i32) -> i32 {
    let len = 4;
    let arrayA = unsafe { slice::from_raw_parts(dataA, len as usize)};
    let arrayB = unsafe { slice::from_raw_parts(dataB, len as usize)};
    let mut arrayC = unsafe { slice::from_raw_parts_mut(dataC, len as usize)};
    unsafe {
        let memc = dataC as *mut _;
        let mema = dataA as *const _;
        let memb = dataB as *const _;
        let a = _mm_loadu_si128(mema);
        let b = _mm_loadu_si128(memb);
        // let a = _mm_set_epi32(arrayA[3], arrayA[2], arrayA[1], arrayA[0]);
        // let b = _mm_set_epi32(arrayB[3], arrayB[2], arrayB[1], arrayB[0]);
        let valc = _mm_add_epi32(a, b);
        let memc = dataC as *mut _;
        _mm_storeu_si128(memc, valc);
        std::mem::forget(memc);
        1
    }
}

#[no_mangle] 
pub fn vsub(dataA: *const i32, dataB: *const i32, dataC: *mut i32) -> i32 {
    let len = 4;
    let arrayA = unsafe { slice::from_raw_parts(dataA, len as usize)};
    let arrayB = unsafe { slice::from_raw_parts(dataB, len as usize)};
    let mut arrayC = unsafe { slice::from_raw_parts_mut(dataC, len as usize)};
    unsafe {
        let memc = dataC as *mut _;
        let mema = dataA as *const _;
        let memb = dataB as *const _;
        let a = _mm_loadu_si128(mema);
        let b = _mm_loadu_si128(memb);
        // let a = _mm_set_epi32(arrayA[3], arrayA[2], arrayA[1], arrayA[0]);
        // let b = _mm_set_epi32(arrayB[3], arrayB[2], arrayB[1], arrayB[0]);
        let valc = _mm_sub_epi32(a, b);
        let memc = dataC as *mut _;
        _mm_storeu_si128(memc, valc);
        std::mem::forget(memc);
        1
    }
}

#[no_mangle] 
pub fn vmul(dataA: *const i32, dataB: *const i32, dataC: *mut i32) -> i32 {
    let len = 4;
    let arrayA = unsafe { slice::from_raw_parts(dataA, len as usize)};
    let arrayB = unsafe { slice::from_raw_parts(dataB, len as usize)};
    let mut arrayC = unsafe { slice::from_raw_parts_mut(dataC, len as usize)};
    unsafe {
        let memc = dataC as *mut _;
        let mema = dataA as *const _;
        let memb = dataB as *const _;
        let a = _mm_loadu_si128(mema);
        let b = _mm_loadu_si128(memb);
        // let a = _mm_set_epi32(arrayA[3], arrayA[2], arrayA[1], arrayA[0]);
        // let b = _mm_set_epi32(arrayB[3], arrayB[2], arrayB[1], arrayB[0]);
        let valc = _mm_mul_epi32(a, b);
        let memc = dataC as *mut _;
        _mm_storeu_si128(memc, valc);
        std::mem::forget(memc);
        1
    }
}


