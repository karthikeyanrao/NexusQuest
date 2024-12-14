
#[test_only]
module moon_race::moon_race_tests;
// uncomment this line to import the module
// use moon_race::moon_race;

const ENotImplemented: u64 = 0;

#[test]
fun test_moon_race() {
     pass
}

#[test, expected_failure(abort_code = ::moon_race::moon_race_tests::ENotImplemented)]
fun test_moon_race_fail() {
    abort ENotImplemented
}

